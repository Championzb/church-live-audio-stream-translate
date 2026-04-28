use std::fs;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;

use base64::Engine;
use chrono::{Datelike, TimeZone, Utc};
use reqwest::multipart::{Form, Part};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::Emitter;
use tauri::Manager;
use tauri::WebviewUrl;
use tauri::WebviewWindowBuilder;
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Shortcut};
use tauri_plugin_log::{Target, TargetKind};

struct AppState {
    api_key: Mutex<Option<String>>,
    admin_api_key: Mutex<Option<String>>,
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
    #[serde(alias = "targetLanguage")]
    target_language: Option<String>,
    #[serde(alias = "sourceLanguage")]
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
#[serde(rename_all = "camelCase")]
struct SavedRawKeysResponse {
    api_key: String,
    admin_api_key: String,
}

#[derive(Serialize)]
struct RunningResponse {
    running: bool,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ProjectCostsResponse {
    ok: bool,
    today_cost: f64,
    month_cost: f64,
    currency: String,
}

#[derive(Deserialize)]
struct CostsPageResponse {
    data: Vec<CostsBucket>,
    next_page: Option<String>,
}

#[derive(Deserialize)]
struct CostsBucket {
    start_time: i64,
    results: Vec<CostsResult>,
}

#[derive(Deserialize)]
struct CostsResult {
    amount: CostsAmount,
    project_id: Option<String>,
}

#[derive(Deserialize)]
struct CostsAmount {
    #[serde(deserialize_with = "deserialize_f64_from_string_or_number")]
    value: f64,
    currency: String,
}

fn deserialize_f64_from_string_or_number<'de, D>(deserializer: D) -> Result<f64, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let raw = Value::deserialize(deserializer)?;
    match raw {
        Value::Number(number) => number
            .as_f64()
            .ok_or_else(|| serde::de::Error::custom("invalid numeric value for cost amount")),
        Value::String(text) => text
            .trim()
            .parse::<f64>()
            .map_err(|e| serde::de::Error::custom(format!("invalid string numeric value for cost amount: {e}"))),
        other => Err(serde::de::Error::custom(format!(
            "unsupported cost amount value type: {other}"
        ))),
    }
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
const KEYRING_ADMIN_ACCOUNT: &str = "openai_admin_api_key";

fn log_api_key_storage(message: &str) {
    log::info!("[api-key-storage] {message}");
}

fn log_project_costs(message: &str) {
    log::info!("[project-costs] {message}");
}

fn truncate_for_log(value: &str, max_chars: usize) -> String {
    let mut out = String::new();
    for (idx, ch) in value.chars().enumerate() {
        if idx >= max_chars {
            out.push_str("...");
            break;
        }
        out.push(ch);
    }
    out
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

fn fallback_admin_api_key_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let config_dir = app
        .path()
        .app_config_dir()
        .map_err(|e| format!("Failed to resolve app config directory: {e}"))?;
    Ok(config_dir.join("admin_api_key_fallback.txt"))
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

fn save_fallback_admin_api_key(app: &tauri::AppHandle, admin_api_key: &str) -> Result<(), String> {
    let path = fallback_admin_api_key_path(app)?;
    log_api_key_storage(&format!("admin fallback path resolved: {}", path.display()));
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create app config directory: {e}"))?;
    }
    fs::write(path, admin_api_key)
        .map_err(|e| format!("Failed to persist fallback admin API key: {e}"))?;
    Ok(())
}

fn load_fallback_admin_api_key(app: &tauri::AppHandle) -> Result<Option<String>, String> {
    let path = fallback_admin_api_key_path(app)?;
    log_api_key_storage(&format!("checking admin fallback path: {}", path.display()));
    if !path.exists() {
        log_api_key_storage("admin fallback key file not found");
        return Ok(None);
    }
    let value = fs::read_to_string(path)
        .map_err(|e| format!("Failed to read fallback admin API key: {e}"))?;
    let trimmed = value.trim().to_string();
    if trimmed.is_empty() {
        log_api_key_storage("admin fallback key file exists but is empty");
        return Ok(None);
    }
    log_api_key_storage(&format!(
        "loaded admin API key from fallback file (masked: {})",
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

fn looks_english_heavy(text: &str) -> bool {
    let mut ascii_letters = 0usize;
    let mut cjk_chars = 0usize;

    for ch in text.chars() {
        if ch.is_ascii_alphabetic() {
            ascii_letters += 1;
            continue;
        }
        if ('\u{4E00}'..='\u{9FFF}').contains(&ch) || ('\u{3400}'..='\u{4DBF}').contains(&ch) {
            cjk_chars += 1;
        }
    }

    ascii_letters >= 24 && ascii_letters > cjk_chars * 3
}

fn fallback_translation_text(target_language: &str) -> String {
    match target_language {
        "zh-hans" => "（翻译暂时不可用）".to_string(),
        "zh-hant" => "（翻譯暫時不可用）".to_string(),
        "korean" => "(번역을 일시적으로 사용할 수 없습니다)".to_string(),
        "japanese" => "（翻訳を一時的に利用できません）".to_string(),
        "spanish" => "(La traduccion no esta disponible temporalmente)".to_string(),
        _ => "(Translation unavailable)".to_string(),
    }
}

fn extract_responses_text(payload: &serde_json::Value) -> String {
    if let Some(text) = payload.get("output_text").and_then(|v| v.as_str()) {
        let trimmed = text.trim();
        if !trimmed.is_empty() {
            return trimmed.to_string();
        }
    }

    let mut parts: Vec<String> = Vec::new();
    if let Some(outputs) = payload.get("output").and_then(|v| v.as_array()) {
        for output in outputs {
            if let Some(content_items) = output.get("content").and_then(|v| v.as_array()) {
                for item in content_items {
                    if let Some(text) = item.get("text").and_then(|v| v.as_str()) {
                        let trimmed = text.trim();
                        if !trimmed.is_empty() {
                            parts.push(trimmed.to_string());
                        }
                    }
                    if let Some(text) = item.get("output_text").and_then(|v| v.as_str()) {
                        let trimmed = text.trim();
                        if !trimmed.is_empty() {
                            parts.push(trimmed.to_string());
                        }
                    }
                }
            }
        }
    }

    parts.join("\n").trim().to_string()
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
fn config_admin_api_key(
    admin_api_key: String,
    app: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
) -> Result<ApiKeyConfigResponse, String> {
    let trimmed = admin_api_key.trim().to_string();
    if trimmed.is_empty() {
        return Err("Admin API key is empty".to_string());
    }
    let secure_value = trimmed.clone();

    let mut key_guard = state
        .admin_api_key
        .lock()
        .map_err(|_| "Failed to lock admin API key state".to_string())?;
    *key_guard = Some(trimmed);

    log_api_key_storage(&format!(
        "saving admin API key (masked: {})",
        mask_api_key(&secure_value)
    ));

    match keyring::Entry::new(KEYRING_SERVICE, KEYRING_ADMIN_ACCOUNT) {
        Ok(entry) => match entry.set_password(&secure_value) {
            Ok(_) => log_api_key_storage("saved admin API key to keyring"),
            Err(e) => log_api_key_storage(&format!("admin keyring save failed: {e}")),
        },
        Err(e) => log_api_key_storage(&format!("admin keyring init failed: {e}")),
    }

    save_fallback_admin_api_key(&app, &secure_value)?;
    log_api_key_storage("saved admin API key to fallback file");

    Ok(ApiKeyConfigResponse {
        ok: true,
        masked_key: mask_api_key(&secure_value),
    })
}

#[tauri::command]
fn load_saved_admin_api_key(
    app: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
) -> Result<SavedApiKeyResponse, String> {
    log_api_key_storage("loading saved admin API key");
    let mut value_from_storage: Option<String> = None;

    match keyring::Entry::new(KEYRING_SERVICE, KEYRING_ADMIN_ACCOUNT) {
        Ok(entry) => match entry.get_password() {
            Ok(value) if !value.trim().is_empty() => {
                log_api_key_storage("loaded admin API key from keyring");
                value_from_storage = Some(value.trim().to_string());
            }
            Ok(_) => log_api_key_storage("admin keyring entry is empty"),
            Err(keyring::Error::NoEntry) => log_api_key_storage("no admin keyring entry found"),
            Err(e) => log_api_key_storage(&format!("admin keyring read failed: {e}")),
        },
        Err(e) => log_api_key_storage(&format!("admin keyring init failed: {e}")),
    }

    if value_from_storage.is_none() {
        log_api_key_storage("falling back to local admin key file");
        value_from_storage = load_fallback_admin_api_key(&app)?;
    }

    if let Some(value) = value_from_storage {
        let mut key_guard = state
            .admin_api_key
            .lock()
            .map_err(|_| "Failed to lock admin API key state".to_string())?;
        *key_guard = Some(value.clone());
        log_api_key_storage(&format!(
            "admin API key loaded successfully (masked: {})",
            mask_api_key(&value)
        ));
        return Ok(SavedApiKeyResponse {
            found: true,
            masked_key: Some(mask_api_key(&value)),
        });
    }

    log_api_key_storage("no saved admin API key found in keyring or fallback file");
    Ok(SavedApiKeyResponse {
        found: false,
        masked_key: None,
    })
}

#[tauri::command]
fn load_saved_raw_keys_for_update_panel(
    app: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
) -> Result<SavedRawKeysResponse, String> {
    let current_api_key = {
        let guard = state
            .api_key
            .lock()
            .map_err(|_| "Failed to lock API key state".to_string())?;
        guard.clone()
    };
    let current_admin_api_key = {
        let guard = state
            .admin_api_key
            .lock()
            .map_err(|_| "Failed to lock admin API key state".to_string())?;
        guard.clone()
    };

    let api_key = if let Some(value) = current_api_key {
        value
    } else {
        let keyring_value = match keyring::Entry::new(KEYRING_SERVICE, KEYRING_ACCOUNT) {
            Ok(entry) => match entry.get_password() {
                Ok(value) if !value.trim().is_empty() => Some(value.trim().to_string()),
                _ => None,
            },
            Err(_) => None,
        };
        if let Some(value) = keyring_value {
            let mut guard = state
                .api_key
                .lock()
                .map_err(|_| "Failed to lock API key state".to_string())?;
            *guard = Some(value.clone());
            value
        } else {
            load_fallback_api_key(&app)?.unwrap_or_default()
        }
    };

    let admin_api_key = if let Some(value) = current_admin_api_key {
        value
    } else {
        let keyring_value = match keyring::Entry::new(KEYRING_SERVICE, KEYRING_ADMIN_ACCOUNT) {
            Ok(entry) => match entry.get_password() {
                Ok(value) if !value.trim().is_empty() => Some(value.trim().to_string()),
                _ => None,
            },
            Err(_) => None,
        };
        if let Some(value) = keyring_value {
            let mut guard = state
                .admin_api_key
                .lock()
                .map_err(|_| "Failed to lock admin API key state".to_string())?;
            *guard = Some(value.clone());
            value
        } else {
            load_fallback_admin_api_key(&app)?.unwrap_or_default()
        }
    };

    Ok(SavedRawKeysResponse {
        api_key,
        admin_api_key,
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
async fn fetch_project_costs(
    project_id: String,
    state: tauri::State<'_, AppState>,
) -> Result<ProjectCostsResponse, String> {
    let project_id = project_id.trim().to_string();
    if project_id.is_empty() {
        return Err("Project ID is empty.".to_string());
    }
    if !project_id.starts_with("proj_") {
        return Err("Project ID must start with 'proj_'.".to_string());
    }

    let admin_api_key = {
        let key_guard = state
            .admin_api_key
            .lock()
            .map_err(|_| "Failed to lock admin API key state".to_string())?;
        key_guard.clone()
    };
    let api_key = {
        let key_guard = state
            .api_key
            .lock()
            .map_err(|_| "Failed to lock API key state".to_string())?;
        key_guard.clone()
    };
    let using_admin_key = admin_api_key.is_some();
    let billing_key = admin_api_key
        .or(api_key)
        .ok_or_else(|| "OpenAI API key is not configured.".to_string())?;
    log_project_costs(&format!(
        "fetch start for project_id={} using {} key",
        project_id,
        if using_admin_key { "admin" } else { "main" }
    ));

    let now = Utc::now();
    let month_start = Utc
        .with_ymd_and_hms(now.year(), now.month(), 1, 0, 0, 0)
        .single()
        .ok_or_else(|| "Failed to compute month start timestamp.".to_string())?;
    let today_start = Utc
        .with_ymd_and_hms(now.year(), now.month(), now.day(), 0, 0, 0)
        .single()
        .ok_or_else(|| "Failed to compute day start timestamp.".to_string())?;

    let client = Client::new();
    let mut month_cost = 0.0_f64;
    let mut today_cost = 0.0_f64;
    let mut currency = "usd".to_string();
    let today_start_ts = today_start.timestamp();
    let mut page_cursor: Option<String> = None;
    let mut page_count: usize = 0;

    loop {
        page_count += 1;
        if page_count > 50 {
            log::error!("[project-costs] pagination exceeded safe limit for project_id={project_id}");
            return Err("Project costs response pagination exceeded safe limit.".to_string());
        }

        let mut query: Vec<(&str, String)> = vec![
            ("start_time", month_start.timestamp().to_string()),
            ("end_time", now.timestamp().to_string()),
            ("bucket_width", "1d".to_string()),
            ("group_by", "project_id".to_string()),
            ("project_ids[]", project_id.clone()),
            ("limit", "180".to_string()),
        ];
        if let Some(cursor) = page_cursor.clone() {
            query.push(("page", cursor));
        }

        let response = client
            .get("https://api.openai.com/v1/organization/costs")
            .bearer_auth(&billing_key)
            .query(&query)
            .send()
            .await
            .map_err(|e| {
                log::error!("[project-costs] request failed for project_id={project_id}: {e}");
                format!("Project costs request failed: {e}")
            })?;

        if !response.status().is_success() {
            let status = response.status();
            let body = response
                .text()
                .await
                .unwrap_or_else(|_| "Unable to read error body".to_string());
            log::error!(
                "[project-costs] request failed for project_id={project_id}, status={status}, body={}",
                truncate_for_log(&body, 500)
            );
            return Err(format!(
                "Project costs request failed ({status}): {body}"
            ));
        }

        let response_text = response.text().await.map_err(|e| {
            log::error!("[project-costs] failed to read response body for project_id={project_id}: {e}");
            format!("Project costs response read failed: {e}")
        })?;
        let costs_page = serde_json::from_str::<CostsPageResponse>(&response_text).map_err(|e| {
            log::error!(
                "[project-costs] response decode failed for project_id={project_id}: {e}; body={}",
                truncate_for_log(&response_text, 900)
            );
            format!("Project costs response decode failed: {e}")
        })?;

        for bucket in costs_page.data {
            let mut bucket_total = 0.0_f64;
            for result in bucket.results {
                if result.project_id.as_deref() != Some(project_id.as_str()) {
                    continue;
                }
                bucket_total += result.amount.value;
                if !result.amount.currency.trim().is_empty() {
                    currency = result.amount.currency.to_lowercase();
                }
            }

            month_cost += bucket_total;
            if bucket.start_time >= today_start_ts {
                today_cost += bucket_total;
            }
        }

        match costs_page.next_page {
            Some(next) if !next.trim().is_empty() => {
                page_cursor = Some(next);
            }
            _ => break,
        }
    }

    log_project_costs(&format!(
        "fetch success for project_id={}, today_cost={:.6}, month_cost={:.6}, currency={}",
        project_id, today_cost, month_cost, currency
    ));

    Ok(ProjectCostsResponse {
        ok: true,
        today_cost,
        month_cost,
        currency,
    })
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
                        .json::<serde_json::Value>()
                        .await
                        .map_err(|e| format!("Korean fallback EN decode failed: {e}"))?;
                    extract_responses_text(&english_json)
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
                    .json::<serde_json::Value>()
                    .await
                    .map_err(|e| format!("Korean fallback EN decode failed: {e}"))?;
                extract_responses_text(&english_json)
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
            .json::<serde_json::Value>()
            .await
            .map_err(|e| format!("{source_label} -> English decode failed: {e}"))?;
        extract_responses_text(&english_json)
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
                .json::<serde_json::Value>()
                .await
                .map_err(|e| format!("Chinese translation decode failed: {e}"))?;
            let mut translated_text = extract_responses_text(&json);

            if translated_text.is_empty()
                || ((target_language == "zh-hans" || target_language == "zh-hant")
                    && looks_english_heavy(&translated_text))
            {
                let strict_body = serde_json::json!({
                    "model": "gpt-4o-mini",
                    "input": [
                        {
                            "role": "system",
                            "content": [
                                {
                                    "type": "input_text",
                                    "text": format!(
                                        "Translate the user's English sermon text into {target_label}. Output in {target_label} only (except proper names and Bible references)."
                                    )
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

                if let Ok(retry_resp) = client
                    .post("https://api.openai.com/v1/responses")
                    .bearer_auth(&api_key)
                    .json(&strict_body)
                    .send()
                    .await
                {
                    if retry_resp.status().is_success() {
                        if let Ok(retry_json) = retry_resp.json::<serde_json::Value>().await {
                            let retried = extract_responses_text(&retry_json);
                            if !retried.is_empty() {
                                translated_text = retried;
                            }
                        }
                    }
                }
            }

            if translated_text.trim().is_empty() {
                return Ok(SegmentResult {
                    english: english_text,
                    translated: fallback_translation_text(&target_language),
                    warning: "Target translation returned empty text.".to_string(),
                });
            }

            Ok(SegmentResult {
                english: english_text,
                translated: translated_text,
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
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(log::LevelFilter::Info)
                .targets([
                    Target::new(TargetKind::LogDir { file_name: Some("app".into()) }),
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::Stderr),
                ])
                .build(),
        )
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .manage(AppState {
            api_key: Mutex::new(None),
            admin_api_key: Mutex::new(None),
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
            config_admin_api_key,
            load_saved_admin_api_key,
            load_saved_raw_keys_for_update_panel,
            set_translation_config,
            get_running,
            set_running,
            fetch_project_costs,
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

#[cfg(test)]
mod tests {
    use super::fallback_translation_text;

    #[test]
    fn fallback_translation_is_non_empty_for_chinese_targets() {
        assert!(!fallback_translation_text("zh-hans").trim().is_empty());
        assert!(!fallback_translation_text("zh-hant").trim().is_empty());
    }
}
