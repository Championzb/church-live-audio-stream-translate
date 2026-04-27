use std::fs;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;

use base64::Engine;
use reqwest::multipart::{Form, Part};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use tauri::Emitter;
use tauri::Manager;
use tauri::WebviewUrl;
use tauri::WebviewWindowBuilder;
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Shortcut};

struct AppState {
    api_key: Mutex<Option<String>>,
    glossary: Mutex<String>,
    target_language: Mutex<String>,
    source_language: Mutex<String>,
    running: AtomicBool,
}

#[derive(Deserialize)]
struct SegmentPayload {
    audio_base64: String,
    mime_type: Option<String>,
}

#[derive(Serialize)]
struct SegmentResult {
    english: String,
    translated: String,
    warning: String,
}

#[derive(Deserialize)]
struct TranslationConfig {
    glossary: Option<String>,
    target_language: Option<String>,
    source_language: Option<String>,
}

#[derive(Serialize)]
struct OkResponse {
    ok: bool,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ApiKeyConfigResponse {
    ok: bool,
    masked_key: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct SavedApiKeyResponse {
    found: bool,
    masked_key: Option<String>,
}

#[derive(Serialize)]
struct RunningResponse {
    running: bool,
}

#[derive(Clone, Serialize)]
struct HotkeyTogglePayload {
    running: bool,
}

#[derive(Serialize)]
struct ExportResponse {
    ok: bool,
    path: Option<String>,
    message: Option<String>,
}

#[derive(Serialize)]
struct GlossaryReadResponse {
    ok: bool,
    content: Option<String>,
    message: Option<String>,
}

#[derive(Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct OutputCaptionPayload {
    english_lines: Vec<String>,
    chinese_lines: Vec<String>,
    english_live: String,
    chinese_live: String,
    mode_summary: String,
    target_label: String,
}

#[derive(Deserialize)]
struct TranscriptEntry {
    timestamp: Option<String>,
    english: Option<String>,
    chinese: Option<String>,
}

#[derive(Deserialize)]
struct WhisperResponse {
    text: Option<String>,
}

#[derive(Deserialize)]
struct ResponsesResponse {
    output_text: Option<String>,
}

fn build_audio_form(
    audio_bytes: &[u8],
    extension: &str,
    mime: &str,
    model: &str,
) -> Result<Form, String> {
    let file_part = Part::bytes(audio_bytes.to_vec())
        .file_name(format!("segment.{extension}"))
        .mime_str(mime)
        .map_err(|e| format!("Failed to set audio mime type: {e}"))?;

    Ok(Form::new().part("file", file_part).text("model", model.to_string()))
}

const KEYRING_SERVICE: &str = "church-live-audio-stream-translate";
const KEYRING_ACCOUNT: &str = "openai_api_key";

fn log_api_key_storage(message: &str) {
    eprintln!("[api-key-storage] {message}");
}

fn mask_api_key(value: &str) -> String {
    let trimmed = value.trim();
    let chars: Vec<char> = trimmed.chars().collect();
    if chars.is_empty() {
        return "hidden".to_string();
    }
    if chars.len() <= 8 {
        let prefix: String = chars.iter().take(2).collect();
        return format!("{prefix}***");
    }
    let prefix: String = chars.iter().take(3).collect();
    let suffix: String = chars[chars.len() - 4..].iter().collect();
    format!("{prefix}***{suffix}")
}

fn fallback_api_key_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let config_dir = app
        .path()
        .app_config_dir()
        .map_err(|e| format!("Failed to resolve app config directory: {e}"))?;
    Ok(config_dir.join("api_key_fallback.txt"))
}

fn save_fallback_api_key(app: &tauri::AppHandle, api_key: &str) -> Result<(), String> {
    let path = fallback_api_key_path(app)?;
    log_api_key_storage(&format!("fallback path resolved: {}", path.display()));
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create app config directory: {e}"))?;
    }
    fs::write(path, api_key).map_err(|e| format!("Failed to persist fallback API key: {e}"))?;
    Ok(())
}

fn load_fallback_api_key(app: &tauri::AppHandle) -> Result<Option<String>, String> {
    let path = fallback_api_key_path(app)?;
    log_api_key_storage(&format!("checking fallback path: {}", path.display()));
    if !path.exists() {
        log_api_key_storage("fallback key file not found");
        return Ok(None);
    }
    let value = fs::read_to_string(path)
        .map_err(|e| format!("Failed to read fallback API key: {e}"))?;
    let trimmed = value.trim().to_string();
    if trimmed.is_empty() {
        log_api_key_storage("fallback key file exists but is empty");
        return Ok(None);
    }
    log_api_key_storage(&format!(
        "loaded API key from fallback file (masked: {})",
        mask_api_key(&trimmed)
    ));
    Ok(Some(trimmed))
}

fn source_language_label(code: &str) -> &'static str {
    match code {
        "korean" => "Korean",
        "japanese" => "Japanese",
        "chinese" => "Chinese",
        _ => "English",
    }
}

fn target_language_label(code: &str) -> &'static str {
    match code {
        "zh-hans" => "Simplified Chinese",
        "zh-hant" => "Traditional Chinese",
        "korean" => "Korean",
        "japanese" => "Japanese",
        "spanish" => "Spanish",
        _ => "English",
    }
}

#[tauri::command]
fn config_api_key(
    api_key: String,
    app: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
) -> Result<ApiKeyConfigResponse, String> {
    let trimmed = api_key.trim().to_string();
    if trimmed.is_empty() {
        return Err("API key is empty".to_string());
    }
    let secure_value = trimmed.clone();

    let mut key_guard = state
        .api_key
        .lock()
        .map_err(|_| "Failed to lock API key state".to_string())?;
    *key_guard = Some(trimmed);

    log_api_key_storage(&format!(
        "saving API key (masked: {})",
        mask_api_key(&secure_value)
    ));

    match keyring::Entry::new(KEYRING_SERVICE, KEYRING_ACCOUNT) {
        Ok(entry) => match entry.set_password(&secure_value) {
            Ok(_) => log_api_key_storage("saved API key to keyring"),
            Err(e) => log_api_key_storage(&format!("keyring save failed: {e}")),
        },
        Err(e) => log_api_key_storage(&format!("keyring init failed: {e}")),
    }

    save_fallback_api_key(&app, &secure_value)?;
    log_api_key_storage("saved API key to fallback file");

    Ok(ApiKeyConfigResponse {
        ok: true,
        masked_key: mask_api_key(&secure_value),
    })
}

#[tauri::command]
fn load_saved_api_key(
    app: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
) -> Result<SavedApiKeyResponse, String> {
    log_api_key_storage("loading saved API key");
    let mut value_from_storage: Option<String> = None;

    match keyring::Entry::new(KEYRING_SERVICE, KEYRING_ACCOUNT) {
        Ok(entry) => match entry.get_password() {
            Ok(value) if !value.trim().is_empty() => {
                log_api_key_storage("loaded API key from keyring");
                value_from_storage = Some(value.trim().to_string());
            }
            Ok(_) => log_api_key_storage("keyring entry is empty"),
            Err(keyring::Error::NoEntry) => log_api_key_storage("no keyring entry found"),
            Err(e) => log_api_key_storage(&format!("keyring read failed: {e}")),
        },
        Err(e) => log_api_key_storage(&format!("keyring init failed: {e}")),
    }

    if value_from_storage.is_none() {
        log_api_key_storage("falling back to local key file");
        value_from_storage = load_fallback_api_key(&app)?;
    }

    if let Some(value) = value_from_storage {
        let mut key_guard = state
            .api_key
            .lock()
            .map_err(|_| "Failed to lock API key state".to_string())?;
        *key_guard = Some(value.clone());
        log_api_key_storage(&format!(
            "API key loaded successfully (masked: {})",
            mask_api_key(&value)
        ));
        return Ok(SavedApiKeyResponse {
            found: true,
            masked_key: Some(mask_api_key(&value)),
        });
    }

    log_api_key_storage("no saved API key found in keyring or fallback file");
    Ok(SavedApiKeyResponse {
        found: false,
        masked_key: None,
    })
}

#[tauri::command]
fn set_translation_config(
    config: TranslationConfig,
    state: tauri::State<'_, AppState>,
) -> Result<OkResponse, String> {
    let glossary = config.glossary.unwrap_or_default().trim().to_string();
    let target_language = match config.target_language.as_deref() {
        Some("zh-hans") => "zh-hans".to_string(),
        Some("zh-hant") => "zh-hant".to_string(),
        Some("korean") => "korean".to_string(),
        Some("japanese") => "japanese".to_string(),
        Some("spanish") => "spanish".to_string(),
        _ => "english".to_string(),
    };
    let source_language = match config.source_language.as_deref() {
        Some("english") => "english".to_string(),
        Some("japanese") => "japanese".to_string(),
        Some("chinese") => "chinese".to_string(),
        _ => "korean".to_string(),
    };

    {
        let mut glossary_guard = state
            .glossary
            .lock()
            .map_err(|_| "Failed to lock glossary state".to_string())?;
        *glossary_guard = glossary;
    }

    {
        let mut target_language_guard = state
            .target_language
            .lock()
            .map_err(|_| "Failed to lock target language state".to_string())?;
        *target_language_guard = target_language;
    }

    {
        let mut source_language_guard = state
            .source_language
            .lock()
            .map_err(|_| "Failed to lock source language state".to_string())?;
        *source_language_guard = source_language;
    }

    Ok(OkResponse { ok: true })
}

#[tauri::command]
fn get_running(state: tauri::State<'_, AppState>) -> RunningResponse {
    RunningResponse {
        running: state.running.load(Ordering::SeqCst),
    }
}

#[tauri::command]
fn set_running(next_running: bool, state: tauri::State<'_, AppState>) -> RunningResponse {
    state.running.store(next_running, Ordering::SeqCst);
    RunningResponse {
        running: next_running,
    }
}

#[tauri::command]
async fn process_segment(
    payload: SegmentPayload,
    state: tauri::State<'_, AppState>,
) -> Result<SegmentResult, String> {
    let api_key = {
        let key_guard = state
            .api_key
            .lock()
            .map_err(|_| "Failed to lock API key state".to_string())?;
        key_guard
            .clone()
            .ok_or_else(|| "OpenAI API key is not configured.".to_string())?
    };

    let glossary = {
        let glossary_guard = state
            .glossary
            .lock()
            .map_err(|_| "Failed to lock glossary state".to_string())?;
        glossary_guard.clone()
    };

    let target_language = {
        let target_language_guard = state
            .target_language
            .lock()
            .map_err(|_| "Failed to lock target language state".to_string())?;
        target_language_guard.clone()
    };

    let source_language = {
        let source_language_guard = state
            .source_language
            .lock()
            .map_err(|_| "Failed to lock source language state".to_string())?;
        source_language_guard.clone()
    };

    let audio_bytes = base64::engine::general_purpose::STANDARD
        .decode(payload.audio_base64)
        .map_err(|e| format!("Failed to decode segment audio: {e}"))?;

    let mime = payload
        .mime_type
        .unwrap_or_else(|| "audio/webm".to_string());

    let extension = if mime.contains("webm") {
        "webm"
    } else if mime.contains("wav") {
        "wav"
    } else if mime.contains("mp4") {
        "m4a"
    } else {
        "webm"
    };

    let client = Client::new();

    let english_text = if source_language == "english" {
        let form = build_audio_form(&audio_bytes, extension, &mime, "gpt-4o-mini-transcribe")?;

        let transcription_response = client
            .post("https://api.openai.com/v1/audio/transcriptions")
            .bearer_auth(&api_key)
            .multipart(form)
            .send()
            .await
            .map_err(|e| format!("Transcription request failed: {e}"))?;

        if !transcription_response.status().is_success() {
            let status = transcription_response.status();
            let body = transcription_response
                .text()
                .await
                .unwrap_or_else(|_| "Unable to read error body".to_string());
            return Err(format!("Transcription request failed ({status}): {body}"));
        }

        let transcription_json = transcription_response
            .json::<WhisperResponse>()
            .await
            .map_err(|e| format!("Transcription response decode failed: {e}"))?;
        transcription_json.text.unwrap_or_default().trim().to_string()
    } else {
        let whisper_form = build_audio_form(&audio_bytes, extension, &mime, "whisper-1")?;

        let whisper_response = client
            .post("https://api.openai.com/v1/audio/translations")
            .bearer_auth(&api_key)
            .multipart(whisper_form)
            .send()
            .await;

        if let Ok(resp) = whisper_response {
            if resp.status().is_success() {
                let whisper_json = resp
                    .json::<WhisperResponse>()
                    .await
                    .map_err(|e| format!("Whisper response decode failed: {e}"))?;
                let whisper_text = whisper_json.text.unwrap_or_default().trim().to_string();
                if !whisper_text.is_empty() {
                    whisper_text
                } else {
                    let transcribe_form =
                        build_audio_form(&audio_bytes, extension, &mime, "gpt-4o-mini-transcribe")?;
                    let transcribe_response = client
                        .post("https://api.openai.com/v1/audio/transcriptions")
                        .bearer_auth(&api_key)
                        .multipart(transcribe_form)
                        .send()
                        .await
                        .map_err(|e| format!("Korean fallback transcription failed: {e}"))?;
                    if !transcribe_response.status().is_success() {
                        let status = transcribe_response.status();
                        let body = transcribe_response
                            .text()
                            .await
                            .unwrap_or_else(|_| "Unable to read error body".to_string());
                        return Err(format!(
                            "Korean fallback transcription failed ({status}): {body}"
                        ));
                    }
                    let transcribe_json = transcribe_response
                        .json::<WhisperResponse>()
                        .await
                        .map_err(|e| format!("Korean fallback decode failed: {e}"))?;
                    let korean_text = transcribe_json.text.unwrap_or_default().trim().to_string();
                    if korean_text.is_empty() {
                        return Err("Korean fallback produced empty text.".to_string());
                    }
                    let english_request = serde_json::json!({
                        "model": "gpt-4o-mini",
                        "input": [
                            {
                                "role": "system",
                                "content": [
                                    {
                                        "type": "input_text",
                                        "text": "Translate Korean sermon text into natural, faithful English. Return only translated English."
                                    }
                                ]
                            },
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "input_text",
                                        "text": korean_text
                                    }
                                ]
                            }
                        ]
                    });
                    let english_response = client
                        .post("https://api.openai.com/v1/responses")
                        .bearer_auth(&api_key)
                        .json(&english_request)
                        .send()
                        .await
                        .map_err(|e| format!("Korean fallback EN translation failed: {e}"))?;
                    if !english_response.status().is_success() {
                        let status = english_response.status();
                        let body = english_response
                            .text()
                            .await
                            .unwrap_or_else(|_| "Unable to read error body".to_string());
                        return Err(format!(
                            "Korean fallback EN translation failed ({status}): {body}"
                        ));
                    }
                    let english_json = english_response
                        .json::<ResponsesResponse>()
                        .await
                        .map_err(|e| format!("Korean fallback EN decode failed: {e}"))?;
                    english_json.output_text.unwrap_or_default().trim().to_string()
                }
            } else {
                let transcribe_form =
                    build_audio_form(&audio_bytes, extension, &mime, "gpt-4o-mini-transcribe")?;
                let transcribe_response = client
                    .post("https://api.openai.com/v1/audio/transcriptions")
                    .bearer_auth(&api_key)
                    .multipart(transcribe_form)
                    .send()
                    .await
                    .map_err(|e| format!("Korean fallback transcription failed: {e}"))?;
                if !transcribe_response.status().is_success() {
                    let status = transcribe_response.status();
                    let body = transcribe_response
                        .text()
                        .await
                        .unwrap_or_else(|_| "Unable to read error body".to_string());
                    return Err(format!(
                        "Whisper translation and fallback transcription both failed ({status}): {body}"
                    ));
                }
                let transcribe_json = transcribe_response
                    .json::<WhisperResponse>()
                    .await
                    .map_err(|e| format!("Korean fallback decode failed: {e}"))?;
                let korean_text = transcribe_json.text.unwrap_or_default().trim().to_string();
                if korean_text.is_empty() {
                    return Err("Korean fallback produced empty text.".to_string());
                }
                let english_request = serde_json::json!({
                    "model": "gpt-4o-mini",
                    "input": [
                        {
                            "role": "system",
                            "content": [
                                {
                                    "type": "input_text",
                                    "text": "Translate Korean sermon text into natural, faithful English. Return only translated English."
                                }
                            ]
                        },
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "input_text",
                                    "text": korean_text
                                }
                            ]
                        }
                    ]
                });
                let english_response = client
                    .post("https://api.openai.com/v1/responses")
                    .bearer_auth(&api_key)
                    .json(&english_request)
                    .send()
                    .await
                    .map_err(|e| format!("Korean fallback EN translation failed: {e}"))?;
                if !english_response.status().is_success() {
                    let status = english_response.status();
                    let body = english_response
                        .text()
                        .await
                        .unwrap_or_else(|_| "Unable to read error body".to_string());
                    return Err(format!(
                        "Korean fallback EN translation failed ({status}): {body}"
                    ));
                }
                let english_json = english_response
                    .json::<ResponsesResponse>()
                    .await
                    .map_err(|e| format!("Korean fallback EN decode failed: {e}"))?;
                english_json.output_text.unwrap_or_default().trim().to_string()
            }
        } else {
            return Err("Whisper request failed and fallback could not start.".to_string());
        }
    };

    let english_text = if source_language != "english" && source_language != "korean" {
        let source_label = source_language_label(&source_language);
        let transcribe_form = build_audio_form(&audio_bytes, extension, &mime, "gpt-4o-mini-transcribe")?;
        let transcribe_response = client
            .post("https://api.openai.com/v1/audio/transcriptions")
            .bearer_auth(&api_key)
            .multipart(transcribe_form)
            .send()
            .await
            .map_err(|e| format!("{source_label} transcription failed: {e}"))?;
        if !transcribe_response.status().is_success() {
            let status = transcribe_response.status();
            let body = transcribe_response
                .text()
                .await
                .unwrap_or_else(|_| "Unable to read error body".to_string());
            return Err(format!("{source_label} transcription failed ({status}): {body}"));
        }
        let transcribe_json = transcribe_response
            .json::<WhisperResponse>()
            .await
            .map_err(|e| format!("{source_label} transcription decode failed: {e}"))?;
        let source_text = transcribe_json.text.unwrap_or_default().trim().to_string();
        if source_text.is_empty() {
            return Err(format!("{source_label} transcription produced empty text."));
        }
        let english_request = serde_json::json!({
            "model": "gpt-4o-mini",
            "input": [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "input_text",
                            "text": format!("Translate {source_label} sermon text into natural, faithful English. Return only translated English.")
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": source_text
                        }
                    ]
                }
            ]
        });
        let english_response = client
            .post("https://api.openai.com/v1/responses")
            .bearer_auth(&api_key)
            .json(&english_request)
            .send()
            .await
            .map_err(|e| format!("{source_label} -> English translation failed: {e}"))?;
        if !english_response.status().is_success() {
            let status = english_response.status();
            let body = english_response
                .text()
                .await
                .unwrap_or_else(|_| "Unable to read error body".to_string());
            return Err(format!("{source_label} -> English translation failed ({status}): {body}"));
        }
        let english_json = english_response
            .json::<ResponsesResponse>()
            .await
            .map_err(|e| format!("{source_label} -> English decode failed: {e}"))?;
        english_json.output_text.unwrap_or_default().trim().to_string()
    } else {
        english_text
    };

    if english_text.is_empty() {
        return Ok(SegmentResult {
            english: String::new(),
            translated: String::new(),
            warning: "Empty transcription result for this segment.".to_string(),
        });
    }

    let target_label = target_language_label(&target_language);
    if target_language == "english" {
        return Ok(SegmentResult {
            english: english_text.clone(),
            translated: english_text,
            warning: String::new(),
        });
    }

    let glossary_prompt = if glossary.is_empty() {
        String::new()
    } else {
        format!("\nGlossary and preferred translations:\n{glossary}")
    };

    let system_prompt = format!(
        "Translate church sermon English into natural {target_label}.\nKeep Bible references accurate.\nPreserve names and church terms.\nReturn only the translated text.{glossary_prompt}"
    );

    let chinese_request_body = serde_json::json!({
        "model": "gpt-4o-mini",
        "input": [
            {
                "role": "system",
                "content": [
                    {
                        "type": "input_text",
                        "text": system_prompt
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": english_text
                    }
                ]
            }
        ]
    });

    let chinese_response = client
        .post("https://api.openai.com/v1/responses")
        .bearer_auth(&api_key)
        .json(&chinese_request_body)
        .send()
        .await
        .map_err(|e| format!("Chinese translation request failed: {e}"));

    match chinese_response {
        Ok(resp) => {
            if !resp.status().is_success() {
                let status = resp.status();
                let body = resp
                    .text()
                    .await
                    .unwrap_or_else(|_| "Unable to read error body".to_string());
                return Ok(SegmentResult {
                    english: english_text,
                    translated: String::new(),
                    warning: format!("Target translation failed ({status}): {body}"),
                });
            }

            let json = resp
                .json::<ResponsesResponse>()
                .await
                .map_err(|e| format!("Chinese translation decode failed: {e}"))?;

            Ok(SegmentResult {
                english: english_text,
                translated: json.output_text.unwrap_or_default().trim().to_string(),
                warning: String::new(),
            })
        }
        Err(error) => Ok(SegmentResult {
            english: english_text,
            translated: String::new(),
            warning: error,
        }),
    }
}

#[tauri::command]
fn export_transcript(entries: Vec<TranscriptEntry>) -> Result<ExportResponse, String> {
    if entries.is_empty() {
        return Ok(ExportResponse {
            ok: false,
            path: None,
            message: Some("No transcript entries to export.".to_string()),
        });
    }

    let file_name = format!(
        "church-translation-{}.txt",
        chrono::Local::now().format("%Y-%m-%d_%H-%M-%S")
    );

    let save_path = rfd::FileDialog::new()
        .add_filter("Text file", &["txt"])
        .set_file_name(&file_name)
        .save_file();

    let Some(path) = save_path else {
        return Ok(ExportResponse {
            ok: false,
            path: None,
            message: Some("Export canceled.".to_string()),
        });
    };

    let content = entries
        .iter()
        .map(|entry| {
            let stamp = entry.timestamp.clone().unwrap_or_default();
            let english = entry.english.clone().unwrap_or_default();
            let chinese = entry.chinese.clone().unwrap_or_default();
            format!("[{stamp}] EN: {english}\n[{stamp}] ZH: {chinese}")
        })
        .collect::<Vec<_>>()
        .join("\n\n");

    fs::write(&path, content).map_err(|e| format!("Failed to write transcript: {e}"))?;

    Ok(ExportResponse {
        ok: true,
        path: Some(path.display().to_string()),
        message: None,
    })
}

#[tauri::command]
fn auto_save_transcript(entries: Vec<TranscriptEntry>) -> Result<ExportResponse, String> {
    if entries.is_empty() {
        return Ok(ExportResponse {
            ok: false,
            path: None,
            message: Some("No transcript entries to auto-save.".to_string()),
        });
    }

    let home_dir = std::env::var("HOME").map_err(|_| "Could not locate HOME directory.".to_string())?;
    let sessions_dir = std::path::Path::new(&home_dir).join("Desktop").join("ChurchTranslateSessions");
    fs::create_dir_all(&sessions_dir).map_err(|e| format!("Failed to create session folder: {e}"))?;

    let file_name = format!(
        "church-translation-{}.txt",
        chrono::Local::now().format("%Y-%m-%d_%H-%M-%S")
    );
    let file_path = sessions_dir.join(file_name);

    let content = entries
        .iter()
        .map(|entry| {
            let stamp = entry.timestamp.clone().unwrap_or_default();
            let english = entry.english.clone().unwrap_or_default();
            let chinese = entry.chinese.clone().unwrap_or_default();
            format!("[{stamp}] EN: {english}\n[{stamp}] ZH: {chinese}")
        })
        .collect::<Vec<_>>()
        .join("\n\n");

    fs::write(&file_path, content).map_err(|e| format!("Failed to auto-save transcript: {e}"))?;

    Ok(ExportResponse {
        ok: true,
        path: Some(file_path.display().to_string()),
        message: None,
    })
}

#[tauri::command]
fn import_glossary() -> Result<GlossaryReadResponse, String> {
    let open_path = rfd::FileDialog::new()
        .add_filter("Text file", &["txt"])
        .pick_file();

    let Some(path) = open_path else {
        return Ok(GlossaryReadResponse {
            ok: false,
            content: None,
            message: Some("Import canceled.".to_string()),
        });
    };

    let content = fs::read_to_string(&path).map_err(|e| format!("Failed to read glossary: {e}"))?;

    Ok(GlossaryReadResponse {
        ok: true,
        content: Some(content),
        message: None,
    })
}

#[tauri::command]
fn export_glossary(content: String) -> Result<ExportResponse, String> {
    let save_path = rfd::FileDialog::new()
        .add_filter("Text file", &["txt"])
        .set_file_name("church-glossary.txt")
        .save_file();

    let Some(path) = save_path else {
        return Ok(ExportResponse {
            ok: false,
            path: None,
            message: Some("Export canceled.".to_string()),
        });
    };

    fs::write(&path, content).map_err(|e| format!("Failed to write glossary: {e}"))?;

    Ok(ExportResponse {
        ok: true,
        path: Some(path.display().to_string()),
        message: None,
    })
}

#[tauri::command]
fn toggle_output_window(app: tauri::AppHandle) -> Result<OkResponse, String> {
    if let Some(window) = app.get_webview_window("output") {
        let _ = window.close();
        return Ok(OkResponse { ok: true });
    }

    let builder = WebviewWindowBuilder::new(&app, "output", WebviewUrl::App("output.html".into()))
        .title("Church Subtitle Output")
        .inner_size(1600.0, 900.0)
        .resizable(true);

    builder
        .build()
        .map_err(|e| format!("Failed to open output window: {e}"))?;

    Ok(OkResponse { ok: true })
}

#[tauri::command]
fn push_output_caption(payload: OutputCaptionPayload, app: tauri::AppHandle) -> Result<OkResponse, String> {
    if let Some(window) = app.get_webview_window("output") {
        let _ = window.emit("output-caption", payload);
    }
    Ok(OkResponse { ok: true })
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .manage(AppState {
            api_key: Mutex::new(None),
            glossary: Mutex::new(String::new()),
            target_language: Mutex::new("zh-hans".to_string()),
            source_language: Mutex::new("korean".to_string()),
            running: AtomicBool::new(false),
        })
        .setup(|app| {
            let handle = app.handle();
            let shortcut = Shortcut::new(None, Code::F8);

            handle
                .global_shortcut()
                .on_shortcut(shortcut, move |app, _shortcut, _event| {
                    let state = app.state::<AppState>();
                    let running_now = !state.running.load(Ordering::SeqCst);
                    state.running.store(running_now, Ordering::SeqCst);

                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.emit(
                            "toggle-from-hotkey",
                            HotkeyTogglePayload {
                                running: running_now,
                            },
                        );
                    }
                })
                .map_err(|e| -> Box<dyn std::error::Error> { Box::new(e) })?;

            let presentation_shortcut = Shortcut::new(None, Code::F6);

            handle
                .global_shortcut()
                .on_shortcut(presentation_shortcut, move |app, _shortcut, _event| {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.emit("toggle-presentation-mode", true);
                    }
                })
                .map_err(|e| -> Box<dyn std::error::Error> { Box::new(e) })?;

            let worship_shortcut = Shortcut::new(None, Code::F7);

            handle
                .global_shortcut()
                .on_shortcut(worship_shortcut, move |app, _shortcut, _event| {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.emit("toggle-worship-mode", true);
                    }
                })
                .map_err(|e| -> Box<dyn std::error::Error> { Box::new(e) })?;

            let help_shortcut = Shortcut::new(None, Code::F1);

            handle
                .global_shortcut()
                .on_shortcut(help_shortcut, move |app, _shortcut, _event| {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.emit("toggle-help-overlay", true);
                    }
                })
                .map_err(|e| -> Box<dyn std::error::Error> { Box::new(e) })?;

            let reset_shortcut = Shortcut::new(None, Code::F4);

            handle
                .global_shortcut()
                .on_shortcut(reset_shortcut, move |app, _shortcut, _event| {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.emit("reset-session", true);
                    }
                })
                .map_err(|e| -> Box<dyn std::error::Error> { Box::new(e) })?;

            let lock_shortcut = Shortcut::new(None, Code::F2);

            handle
                .global_shortcut()
                .on_shortcut(lock_shortcut, move |app, _shortcut, _event| {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.emit("toggle-lock-controls", true);
                    }
                })
                .map_err(|e| -> Box<dyn std::error::Error> { Box::new(e) })?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            config_api_key,
            load_saved_api_key,
            set_translation_config,
            get_running,
            set_running,
            process_segment,
            export_transcript,
            auto_save_transcript,
            import_glossary,
            export_glossary,
            toggle_output_window,
            push_output_caption
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
