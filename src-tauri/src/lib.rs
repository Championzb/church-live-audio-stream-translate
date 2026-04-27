use std::fs;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;

use base64::Engine;
use reqwest::multipart::{Form, Part};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use tauri::Emitter;
use tauri::Manager;
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Shortcut};

struct AppState {
    api_key: Mutex<Option<String>>,
    glossary: Mutex<String>,
    chinese_variant: Mutex<String>,
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
    chinese: String,
    warning: String,
}

#[derive(Deserialize)]
struct TranslationConfig {
    glossary: Option<String>,
    chinese_variant: Option<String>,
}

#[derive(Serialize)]
struct OkResponse {
    ok: bool,
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

#[tauri::command]
fn config_api_key(api_key: String, state: tauri::State<'_, AppState>) -> Result<OkResponse, String> {
    let trimmed = api_key.trim().to_string();
    if trimmed.is_empty() {
        return Err("API key is empty".to_string());
    }

    let mut key_guard = state
        .api_key
        .lock()
        .map_err(|_| "Failed to lock API key state".to_string())?;
    *key_guard = Some(trimmed);

    Ok(OkResponse { ok: true })
}

#[tauri::command]
fn set_translation_config(
    config: TranslationConfig,
    state: tauri::State<'_, AppState>,
) -> Result<OkResponse, String> {
    let glossary = config.glossary.unwrap_or_default().trim().to_string();
    let chinese_variant = match config.chinese_variant.as_deref() {
        Some("traditional") => "traditional".to_string(),
        _ => "simplified".to_string(),
    };

    {
        let mut glossary_guard = state
            .glossary
            .lock()
            .map_err(|_| "Failed to lock glossary state".to_string())?;
        *glossary_guard = glossary;
    }

    {
        let mut variant_guard = state
            .chinese_variant
            .lock()
            .map_err(|_| "Failed to lock language variant state".to_string())?;
        *variant_guard = chinese_variant;
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

    let chinese_variant = {
        let variant_guard = state
            .chinese_variant
            .lock()
            .map_err(|_| "Failed to lock language variant state".to_string())?;
        variant_guard.clone()
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

    let file_part = Part::bytes(audio_bytes)
        .file_name(format!("segment.{extension}"))
        .mime_str(&mime)
        .map_err(|e| format!("Failed to set audio mime type: {e}"))?;

    let form = Form::new()
        .part("file", file_part)
        .text("model", "whisper-1");

    let whisper_response = client
        .post("https://api.openai.com/v1/audio/translations")
        .bearer_auth(&api_key)
        .multipart(form)
        .send()
        .await
        .map_err(|e| format!("Whisper request failed: {e}"))?;

    if !whisper_response.status().is_success() {
        let status = whisper_response.status();
        let body = whisper_response
            .text()
            .await
            .unwrap_or_else(|_| "Unable to read error body".to_string());
        return Err(format!("Whisper request failed ({status}): {body}"));
    }

    let whisper_json = whisper_response
        .json::<WhisperResponse>()
        .await
        .map_err(|e| format!("Whisper response decode failed: {e}"))?;

    let english_text = whisper_json.text.unwrap_or_default().trim().to_string();

    if english_text.is_empty() {
        return Ok(SegmentResult {
            english: String::new(),
            chinese: String::new(),
            warning: "Empty transcription result for this segment.".to_string(),
        });
    }

    let target_label = if chinese_variant == "traditional" {
        "Traditional Chinese"
    } else {
        "Simplified Chinese"
    };

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
                    chinese: String::new(),
                    warning: format!("Chinese translation failed ({status}): {body}"),
                });
            }

            let json = resp
                .json::<ResponsesResponse>()
                .await
                .map_err(|e| format!("Chinese translation decode failed: {e}"))?;

            Ok(SegmentResult {
                english: english_text,
                chinese: json.output_text.unwrap_or_default().trim().to_string(),
                warning: String::new(),
            })
        }
        Err(error) => Ok(SegmentResult {
            english: english_text,
            chinese: String::new(),
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

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .manage(AppState {
            api_key: Mutex::new(None),
            glossary: Mutex::new(String::new()),
            chinese_variant: Mutex::new("simplified".to_string()),
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

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            config_api_key,
            set_translation_config,
            get_running,
            set_running,
            process_segment,
            export_transcript,
            import_glossary,
            export_glossary
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
