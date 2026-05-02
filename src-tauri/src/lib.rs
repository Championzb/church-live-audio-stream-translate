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
use tauri::window::Color;
use tauri::Emitter;
use tauri::LogicalSize;
use tauri::Manager;
use tauri::Size;
use tauri::TitleBarStyle;
use tauri::WebviewUrl;
use tauri::WebviewWindowBuilder;
use tauri::menu::Menu;
#[cfg(target_os = "macos")]
use tauri::menu::{AboutMetadata, SubmenuBuilder};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Shortcut};
use tauri_plugin_log::{Target, TargetKind};

struct AppState {
    api_key: Mutex<Option<String>>,
    admin_api_key: Mutex<Option<String>>,
    glossary: Mutex<String>,
    stt_keywords: Mutex<String>,
    sermon_stt_keywords: Mutex<String>,
    reference_script: Mutex<String>,
    target_language: Mutex<String>,
    source_language: Mutex<String>,
    asr_quality_preset: Mutex<String>,
    rolling_english_context: Mutex<String>,
    rolling_source_context: Mutex<String>,
    latest_output_caption: Mutex<Option<OutputCaptionPayload>>,
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
    #[serde(alias = "sttKeywords")]
    stt_keywords: Option<String>,
    #[serde(alias = "sermonSttKeywords")]
    sermon_stt_keywords: Option<String>,
    #[serde(alias = "referenceScript")]
    reference_script: Option<String>,
    #[serde(alias = "targetLanguage")]
    target_language: Option<String>,
    #[serde(alias = "sourceLanguage")]
    source_language: Option<String>,
    #[serde(alias = "asrQualityPreset")]
    asr_quality_preset: Option<String>,
}

#[derive(Serialize)]
struct OkResponse {
    ok: bool,
}

#[derive(Clone, Serialize)]
struct OutputWindowStatePayload {
    state: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct PushOutputCaptionResponse {
    ok: bool,
    delivered: bool,
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
#[serde(rename_all = "camelCase")]
struct PickedTestAudioFileResponse {
    name: String,
    mime_type: String,
    bytes_base64: String,
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
        Value::String(text) => text.trim().parse::<f64>().map_err(|e| {
            serde::de::Error::custom(format!("invalid string numeric value for cost amount: {e}"))
        }),
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
    source_label: String,
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
    language: Option<String>,
    segments: Option<Vec<WhisperSegment>>,
}

#[derive(Deserialize)]
struct WhisperSegment {
    text: Option<String>,
    avg_logprob: Option<f64>,
    no_speech_prob: Option<f64>,
    compression_ratio: Option<f64>,
}

fn build_audio_form(
    audio_bytes: &[u8],
    extension: &str,
    mime: &str,
    model: &str,
    prompt: Option<&str>,
    language: Option<&str>,
    response_format: Option<&str>,
) -> Result<Form, String> {
    let file_part = Part::bytes(audio_bytes.to_vec())
        .file_name(format!("segment.{extension}"))
        .mime_str(mime)
        .map_err(|e| format!("Failed to set audio mime type: {e}"))?;

    let mut form = Form::new()
        .part("file", file_part)
        .text("model", model.to_string());
    if let Some(prompt_text) = prompt {
        let trimmed = prompt_text.trim();
        if !trimmed.is_empty() {
            form = form.text("prompt", trimmed.to_string());
        }
    }
    if let Some(language_code) = language {
        let trimmed = language_code.trim();
        if !trimmed.is_empty() {
            form = form.text("language", trimmed.to_string());
        }
    }
    if let Some(format_code) = response_format {
        let trimmed = format_code.trim();
        if !trimmed.is_empty() {
            form = form.text("response_format", trimmed.to_string());
        }
    }
    Ok(form)
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

fn mime_from_audio_extension(path: &std::path::Path) -> String {
    let ext = path
        .extension()
        .and_then(|v| v.to_str())
        .unwrap_or_default()
        .to_ascii_lowercase();
    match ext.as_str() {
        "wav" => "audio/wav",
        "mp3" => "audio/mpeg",
        "m4a" => "audio/mp4",
        "aac" => "audio/aac",
        "flac" => "audio/flac",
        "ogg" | "oga" => "audio/ogg",
        "opus" => "audio/opus",
        "webm" => "audio/webm",
        "mpeg" | "mpga" => "audio/mpeg",
        "aif" | "aiff" => "audio/aiff",
        "wma" => "audio/x-ms-wma",
        _ => "application/octet-stream",
    }
    .to_string()
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

fn truncate_for_prompt(value: &str, max_chars: usize) -> String {
    let mut out = String::new();
    for (idx, ch) in value.chars().enumerate() {
        if idx >= max_chars {
            out.push_str("\n...[script truncated for prompt length]");
            break;
        }
        out.push(ch);
    }
    out
}

fn tail_words(value: &str, max_words: usize) -> String {
    if max_words == 0 {
        return String::new();
    }
    let words: Vec<&str> = value.split_whitespace().collect();
    if words.len() <= max_words {
        return words.join(" ");
    }
    words[words.len() - max_words..].join(" ")
}

fn extract_vocab_hints(reference_script: &str, max_terms: usize) -> String {
    if max_terms == 0 || reference_script.trim().is_empty() {
        return String::new();
    }

    let mut terms: Vec<String> = Vec::new();
    for raw in reference_script.split(|c: char| !c.is_alphanumeric() && c != '\'' && c != '-') {
        let token = raw.trim();
        if token.len() < 4 {
            continue;
        }
        if !token
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '\'' || c == '-')
        {
            continue;
        }
        let has_upper = token.chars().any(|c| c.is_ascii_uppercase());
        let has_digit = token.chars().any(|c| c.is_ascii_digit());
        if !has_upper && !has_digit {
            continue;
        }
        let normalized = token.to_string();
        if !terms
            .iter()
            .any(|existing| existing.eq_ignore_ascii_case(&normalized))
        {
            terms.push(normalized);
            if terms.len() >= max_terms {
                break;
            }
        }
    }

    terms.join(", ")
}

fn strip_trailing_keyword_alias(term: &str) -> String {
    let trimmed = term.trim();
    if !trimmed.ends_with(')') {
        return trimmed.to_string();
    }

    if let Some(open_idx) = trimmed.rfind('(') {
        if open_idx > 0 {
            let primary = trimmed[..open_idx].trim();
            let alias = trimmed[open_idx + 1..trimmed.len() - 1].trim();
            if !primary.is_empty() && !alias.is_empty() {
                return primary.to_string();
            }
        }
    }

    trimmed.to_string()
}

fn normalize_keywords(raw_keywords: &str, max_terms: usize) -> String {
    if max_terms == 0 || raw_keywords.trim().is_empty() {
        return String::new();
    }

    let mut terms: Vec<String> = Vec::new();
    for token in raw_keywords.split(|c: char| c == ',' || c == '\n' || c == ';') {
        let normalized = strip_trailing_keyword_alias(token);
        let term = normalized.trim();
        if term.is_empty() {
            continue;
        }
        if term.chars().count() > 48 {
            continue;
        }
        if !terms
            .iter()
            .any(|existing| existing.eq_ignore_ascii_case(term))
        {
            terms.push(term.to_string());
            if terms.len() >= max_terms {
                break;
            }
        }
    }

    terms.join(", ")
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
    let value =
        fs::read_to_string(path).map_err(|e| format!("Failed to read fallback API key: {e}"))?;
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

fn source_language_api_code(code: &str) -> Option<&'static str> {
    match code {
        "korean" => Some("ko"),
        "japanese" => Some("ja"),
        "chinese" => Some("zh"),
        "english" => Some("en"),
        _ => None,
    }
}

fn canonical_language_code(code: &str) -> Option<&'static str> {
    match code.trim().to_lowercase().as_str() {
        "ko" | "korean" => Some("ko"),
        "ja" | "japanese" => Some("ja"),
        "zh" | "chinese" | "zh-cn" | "zh-tw" => Some("zh"),
        "en" | "english" => Some("en"),
        _ => None,
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

fn is_hangul(ch: char) -> bool {
    ('\u{AC00}'..='\u{D7AF}').contains(&ch) || ('\u{1100}'..='\u{11FF}').contains(&ch)
}

fn looks_korean_light(text: &str) -> bool {
    let mut hangul_chars = 0usize;
    let mut latin_chars = 0usize;
    for ch in text.chars() {
        if is_hangul(ch) {
            hangul_chars += 1;
        } else if ch.is_ascii_alphabetic() {
            latin_chars += 1;
        }
    }
    latin_chars >= 18 && hangul_chars * 2 < latin_chars
}

fn sanitize_source_transcript(text: &str) -> String {
    let mut cleaned_lines: Vec<String> = Vec::new();
    let mut previous_normalized = String::new();
    let mut repeated_count = 0usize;

    for raw_line in text.lines() {
        let line = raw_line.trim();
        if line.is_empty() {
            continue;
        }

        let normalized = line
            .chars()
            .filter(|c| !c.is_whitespace())
            .collect::<String>()
            .to_lowercase();
        if normalized == previous_normalized {
            repeated_count += 1;
            if repeated_count >= 2 {
                continue;
            }
        } else {
            previous_normalized = normalized;
            repeated_count = 0;
        }

        let line_lower = line.to_lowercase();
        let looks_assistant_meta = line_lower.contains("as an ai")
            || line_lower.contains("i cannot understand")
            || line_lower.contains("i can't understand")
            || line_lower.contains("please provide")
            || line_lower.contains("continue using chinese")
            || line.contains("抱歉，我无法理解")
            || line.contains("请您继续使用中文")
            || line.contains("请您提供具体");
        if looks_assistant_meta {
            continue;
        }
        cleaned_lines.push(line.to_string());
    }

    cleaned_lines.join("\n")
}

fn contains_any(text: &str, terms: &[&str]) -> bool {
    terms.iter().any(|term| text.contains(term))
}

fn korean_chinese_consistency_warnings(korean_text: &str, chinese_text: &str) -> Vec<String> {
    let mut warnings: Vec<String> = Vec::new();
    let ko = korean_text.trim();
    let zh = chinese_text.trim();
    if ko.is_empty() || zh.is_empty() {
        return warnings;
    }

    let anchor_pairs: [(&[&str], &[&str], &str); 6] = [
        (
            &["하나님", "주님", "여호와"],
            &["神", "上帝", "耶和华", "主"],
            "God/Lord anchor missing in Chinese output",
        ),
        (
            &["성경", "말씀"],
            &["圣经", "经文", "神的话", "话语"],
            "Bible/Word anchor missing in Chinese output",
        ),
        (
            &["어디", "어느", "장소"],
            &["哪里", "何处", "地方", "所在"],
            "Place/where anchor missing in Chinese output",
        ),
        (
            &["보시", "보고 계", "지켜보", "감찰"],
            &["看", "注视", "鉴察", "监察", "看顾", "察看"],
            "Watching/seeing anchor missing in Chinese output",
        ),
        (
            &["죄", "범죄", "악"],
            &["罪", "犯罪", "过犯", "恶"],
            "Sin/moral anchor missing in Chinese output",
        ),
        (
            &["코람데오", "coram deo", "하나님 앞"],
            &["Coram Deo", "在神面前", "神面前"],
            "Coram Deo / before-God anchor missing in Chinese output",
        ),
    ];

    for (ko_terms, zh_terms, warning_text) in anchor_pairs {
        if contains_any(ko, ko_terms) && !contains_any(zh, zh_terms) {
            warnings.push(warning_text.to_string());
        }
    }

    let ko_has_no_place = (ko.contains("어디") || ko.contains("장소")) && contains_any(ko, &["없", "아무도 안 보", "안 보이"]);
    let zh_has_neg_place = contains_any(zh, &["没有地方", "无处", "沒有地方", "沒有任何地方", "根本没有"]);
    let zh_has_pos_place = contains_any(zh, &["有地方", "有一个地方", "存在地方", "可以找到地方"]);
    if ko_has_no_place && !zh_has_neg_place {
        warnings.push("Korean no-place polarity may be missing in Chinese output".to_string());
    }
    if ko_has_no_place && zh_has_pos_place {
        warnings.push("Possible polarity flip: Korean says no hidden place, Chinese suggests a place exists".to_string());
    }

    warnings
}

fn transcription_quality_warning(
    source_language: &str,
    expected_language_code: Option<&str>,
    asr_quality_preset: &str,
    response: &WhisperResponse,
    transcript_text: &str,
) -> Option<String> {
    if transcript_text.trim().is_empty() {
        return Some("source transcript is empty".to_string());
    }

    if source_language == "korean" && looks_korean_light(transcript_text) {
        return Some("Korean transcript looks language-mismatched".to_string());
    }

    if let (Some(expected), Some(detected)) = (expected_language_code, response.language.as_deref())
    {
        let expected_canonical = canonical_language_code(expected).unwrap_or(expected);
        let detected_canonical = canonical_language_code(detected).unwrap_or(detected);
        if !detected.trim().is_empty() && detected_canonical != expected_canonical {
            return Some(format!(
                "language mismatch (expected {expected}, detected {detected})"
            ));
        }
    }

    let Some(segments) = response.segments.as_ref() else {
        return None;
    };
    if segments.is_empty() {
        return None;
    }

    let mut low_confidence = 0usize;
    let mut high_no_speech = 0usize;
    let mut repetitive = 0usize;
    let mut scored = 0usize;
    let (low_logprob_threshold, no_speech_threshold, compression_ratio_threshold, fail_ratio) =
        match asr_quality_preset {
            "strict" => (-0.9_f64, 0.55_f64, 2.2_f64, 0.50_f64),
            "permissive" => (-1.2_f64, 0.75_f64, 2.8_f64, 0.75_f64),
            _ => (-1.0_f64, 0.60_f64, 2.4_f64, 0.55_f64),
        };

    for segment in segments {
        if segment
            .text
            .as_deref()
            .unwrap_or_default()
            .trim()
            .is_empty()
        {
            continue;
        }
        scored += 1;
        if segment.avg_logprob.unwrap_or(0.0) < low_logprob_threshold {
            low_confidence += 1;
        }
        if segment.no_speech_prob.unwrap_or(0.0) > no_speech_threshold {
            high_no_speech += 1;
        }
        if segment.compression_ratio.unwrap_or(0.0) > compression_ratio_threshold {
            repetitive += 1;
        }
    }

    if scored == 0 {
        return None;
    }

    let low_ratio = low_confidence as f64 / scored as f64;
    let no_speech_ratio = high_no_speech as f64 / scored as f64;
    let repetitive_ratio = repetitive as f64 / scored as f64;

    if low_ratio > fail_ratio || no_speech_ratio > fail_ratio || repetitive_ratio > fail_ratio {
        return Some(format!(
            "low ASR confidence (low={low_confidence}/{scored}, no_speech={high_no_speech}/{scored}, repetitive={repetitive}/{scored})"
        ));
    }

    None
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
    let stt_keywords = config.stt_keywords.unwrap_or_default().trim().to_string();
    let sermon_stt_keywords = config
        .sermon_stt_keywords
        .unwrap_or_default()
        .trim()
        .to_string();
    let reference_script = config
        .reference_script
        .unwrap_or_default()
        .trim()
        .to_string();
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
    let asr_quality_preset = match config.asr_quality_preset.as_deref() {
        Some("strict") => "strict".to_string(),
        Some("permissive") => "permissive".to_string(),
        _ => "balanced".to_string(),
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
        let mut stt_keywords_guard = state
            .stt_keywords
            .lock()
            .map_err(|_| "Failed to lock STT keywords state".to_string())?;
        *stt_keywords_guard = stt_keywords;
    }

    {
        let mut sermon_stt_keywords_guard = state
            .sermon_stt_keywords
            .lock()
            .map_err(|_| "Failed to lock sermon STT keywords state".to_string())?;
        *sermon_stt_keywords_guard = sermon_stt_keywords;
    }

    {
        let mut reference_script_guard = state
            .reference_script
            .lock()
            .map_err(|_| "Failed to lock reference script state".to_string())?;
        *reference_script_guard = reference_script;
    }

    {
        let mut source_language_guard = state
            .source_language
            .lock()
            .map_err(|_| "Failed to lock source language state".to_string())?;
        *source_language_guard = source_language;
    }

    {
        let mut asr_quality_preset_guard = state
            .asr_quality_preset
            .lock()
            .map_err(|_| "Failed to lock ASR quality preset state".to_string())?;
        *asr_quality_preset_guard = asr_quality_preset;
    }

    {
        let mut context_guard = state
            .rolling_english_context
            .lock()
            .map_err(|_| "Failed to lock rolling context state".to_string())?;
        *context_guard = String::new();
    }
    {
        let mut source_context_guard = state
            .rolling_source_context
            .lock()
            .map_err(|_| "Failed to lock source rolling context state".to_string())?;
        *source_context_guard = String::new();
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
    if !next_running {
        if let Ok(mut context_guard) = state.rolling_english_context.lock() {
            *context_guard = String::new();
        }
        if let Ok(mut source_context_guard) = state.rolling_source_context.lock() {
            *source_context_guard = String::new();
        }
    }
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
            log::error!(
                "[project-costs] pagination exceeded safe limit for project_id={project_id}"
            );
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
            return Err(format!("Project costs request failed ({status}): {body}"));
        }

        let response_text = response.text().await.map_err(|e| {
            log::error!(
                "[project-costs] failed to read response body for project_id={project_id}: {e}"
            );
            format!("Project costs response read failed: {e}")
        })?;
        let costs_page =
            serde_json::from_str::<CostsPageResponse>(&response_text).map_err(|e| {
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
    let asr_quality_preset = {
        let asr_quality_preset_guard = state
            .asr_quality_preset
            .lock()
            .map_err(|_| "Failed to lock ASR quality preset state".to_string())?;
        asr_quality_preset_guard.clone()
    };

    let reference_script = {
        let reference_script_guard = state
            .reference_script
            .lock()
            .map_err(|_| "Failed to lock reference script state".to_string())?;
        reference_script_guard.clone()
    };

    let stt_keywords = {
        let stt_keywords_guard = state
            .stt_keywords
            .lock()
            .map_err(|_| "Failed to lock STT keywords state".to_string())?;
        stt_keywords_guard.clone()
    };

    let sermon_stt_keywords = {
        let sermon_stt_keywords_guard = state
            .sermon_stt_keywords
            .lock()
            .map_err(|_| "Failed to lock sermon STT keywords state".to_string())?;
        sermon_stt_keywords_guard.clone()
    };

    let rolling_english_context_prompt = {
        let context_guard = state
            .rolling_english_context
            .lock()
            .map_err(|_| "Failed to lock rolling context state".to_string())?;
        if context_guard.trim().is_empty() {
            None
        } else {
            Some(format!(
                "Recent sermon context in English:\n{}",
                truncate_for_prompt(context_guard.as_str(), 500)
            ))
        }
    };
    let rolling_source_context_prompt = {
        let context_guard = state
            .rolling_source_context
            .lock()
            .map_err(|_| "Failed to lock source rolling context state".to_string())?;
        if context_guard.trim().is_empty() {
            None
        } else {
            Some(format!(
                "Recent sermon context in source language:\n{}",
                truncate_for_prompt(context_guard.as_str(), 500)
            ))
        }
    };

    let vocab_hint_prompt = {
        let hints = extract_vocab_hints(&reference_script, 48);
        if hints.is_empty() {
            None
        } else {
            Some(format!("Important names/terms and spellings:\n{hints}"))
        }
    };

    let manual_keywords_prompt = {
        let combined_keywords = if sermon_stt_keywords.trim().is_empty() {
            stt_keywords
        } else if stt_keywords.trim().is_empty() {
            sermon_stt_keywords
        } else {
            format!("{stt_keywords}\n{sermon_stt_keywords}")
        };
        let hints = normalize_keywords(&combined_keywords, 64);
        if hints.is_empty() {
            None
        } else {
            Some(format!("User provided STT keyword hints:\n{hints}"))
        }
    };

    let stt_prompt = {
        let mut sections: Vec<String> = Vec::new();
        let selected_context = if source_language == "english" {
            rolling_english_context_prompt
        } else {
            rolling_source_context_prompt
        };
        if let Some(ctx) = selected_context {
            sections.push(ctx);
        }
        if let Some(manual) = manual_keywords_prompt {
            sections.push(manual);
        }
        if let Some(vocab) = vocab_hint_prompt {
            sections.push(vocab);
        }
        if sections.is_empty() {
            None
        } else {
            Some(truncate_for_prompt(&sections.join("\n\n"), 1200))
        }
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

    let source_label = source_language_label(&source_language);
    let (source_text_for_context, mut english_text) = if source_language == "english" {
        let form = build_audio_form(
            &audio_bytes,
            extension,
            &mime,
            "gpt-4o-mini-transcribe",
            stt_prompt.as_deref(),
            source_language_api_code("english"),
            None,
        )?;

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
        let cleaned = sanitize_source_transcript(&transcription_json.text.unwrap_or_default());
        (cleaned.clone(), cleaned)
    } else {
        let source_language_code = source_language_api_code(&source_language);
        let transcribe_form = build_audio_form(
            &audio_bytes,
            extension,
            &mime,
            "whisper-1",
            stt_prompt.as_deref(),
            source_language_code,
            Some("verbose_json"),
        )?;
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
            return Err(format!(
                "{source_label} transcription failed ({status}): {body}"
            ));
        }
        let transcribe_json = transcribe_response
            .json::<WhisperResponse>()
            .await
            .map_err(|e| format!("{source_label} transcription decode failed: {e}"))?;
        let source_text = sanitize_source_transcript(transcribe_json.text.as_deref().unwrap_or(""));
        if source_text.is_empty() {
            return Err(format!("{source_label} transcription produced empty text."));
        }
        if let Some(quality_warning) = transcription_quality_warning(
            &source_language,
            source_language_code,
            &asr_quality_preset,
            &transcribe_json,
            &source_text,
        ) {
            return Ok(SegmentResult {
                english: String::new(),
                translated: String::new(),
                warning: format!("{source_label} transcription skipped: {quality_warning}"),
            });
        }
        // For non-English sources, keep the source transcript as compatibility text
        // while target translation runs directly from source text.
        (source_text.clone(), source_text)
    };

    if source_text_for_context.is_empty() {
        return Ok(SegmentResult {
            english: String::new(),
            translated: String::new(),
            warning: "Empty transcription result for this segment.".to_string(),
        });
    }

    if source_language == "english" {
        let mut context_guard = state
            .rolling_english_context
            .lock()
            .map_err(|_| "Failed to lock rolling context state".to_string())?;
        let merged = if context_guard.trim().is_empty() {
            english_text.clone()
        } else {
            format!("{} {}", context_guard.as_str(), english_text)
        };
        *context_guard = tail_words(&merged, 40);
    }
    {
        let mut source_context_guard = state
            .rolling_source_context
            .lock()
            .map_err(|_| "Failed to lock source rolling context state".to_string())?;
        let merged = if source_context_guard.trim().is_empty() {
            source_text_for_context.clone()
        } else {
            format!(
                "{} {}",
                source_context_guard.as_str(),
                source_text_for_context
            )
        };
        *source_context_guard = tail_words(&merged, 40);
    }

    let target_label = target_language_label(&target_language);
    if target_language == "english" {
        if source_language != "english" {
            let translation_style = if source_language == "korean" {
                format!(
                    "Translate Korean sermon text into natural, faithful English. Keep church terms (e.g., God, Lord, Bible references, Coram Deo) consistent. Return only translated English.{}",
                    if glossary.is_empty() {
                        String::new()
                    } else {
                        format!("\nUse this glossary when possible:\n{}", truncate_for_prompt(&glossary, 1200))
                    }
                )
            } else {
                format!("Translate {source_label} sermon text into natural, faithful English. Return only translated English.")
            };
            let english_request = serde_json::json!({
                "model": "gpt-4o-mini",
                "input": [
                    {
                        "role": "system",
                        "content": [
                            {
                                "type": "input_text",
                                "text": translation_style
                            }
                        ]
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "input_text",
                                "text": source_text_for_context
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
                return Err(format!(
                    "{source_label} -> English translation failed ({status}): {body}"
                ));
            }
            let english_json = english_response
                .json::<serde_json::Value>()
                .await
                .map_err(|e| format!("{source_label} -> English decode failed: {e}"))?;
            english_text = sanitize_source_transcript(&extract_responses_text(&english_json));
        }
        return Ok(SegmentResult {
            english: english_text.clone(),
            translated: english_text,
            warning: String::new(),
        });
    }
    if target_language == source_language {
        return Ok(SegmentResult {
            english: english_text,
            translated: source_text_for_context,
            warning: String::new(),
        });
    }

    let glossary_prompt = if glossary.is_empty() {
        String::new()
    } else {
        format!("\nGlossary and preferred translations:\n{glossary}")
    };

    let reference_script_prompt = if reference_script.is_empty() {
        String::new()
    } else {
        format!(
            "\nReference target-language sermon script (soft guide, may differ from live speech):\n{}\nUse this only as context. Follow the spoken {} meaning first.",
            truncate_for_prompt(&reference_script, 6000)
            ,
            source_label
        )
    };

    let system_prompt = format!(
        "You are an expert theological translator for a live church stream.\nTranslate the incoming live {source_label} into fluent, natural {target_label}.\nUse the reference script as strong context for terminology and sermon flow, but prioritize the live spoken meaning when they differ.\nIf the live input is fragmented, repair it into a coherent sentence using the reference context.\nFor scripture reading lines, prefer official scripture wording when present in the reference script context.\nKeep Bible references, names, and church terms accurate.\nReturn only the translated text.{glossary_prompt}{reference_script_prompt}"
    );

    let target_request_body = serde_json::json!({
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
                        "text": source_text_for_context
                    }
                ]
            }
        ]
    });

    let target_response = client
        .post("https://api.openai.com/v1/responses")
        .bearer_auth(&api_key)
        .json(&target_request_body)
        .send()
        .await
        .map_err(|e| format!("Target translation request failed: {e}"));

    match target_response {
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
                .map_err(|e| format!("Target translation decode failed: {e}"))?;
            let mut translated_text = sanitize_source_transcript(&extract_responses_text(&json));

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
                                        "Translate the user's {source_label} sermon text into {target_label}. Use the reference script as strong context. Repair fragmented phrasing into coherent translation. For scripture lines, prefer official wording when present in the reference script. Output in {target_label} only (except proper names and Bible references).{reference_script_prompt}"
                                    )
                                }
                            ]
                        },
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "input_text",
                                    "text": source_text_for_context
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
                            let retried =
                                sanitize_source_transcript(&extract_responses_text(&retry_json));
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

            let secondary_warnings = if source_language == "korean"
                && (target_language == "zh-hans" || target_language == "zh-hant")
            {
                korean_chinese_consistency_warnings(&source_text_for_context, &translated_text)
            } else {
                Vec::new()
            };

            Ok(SegmentResult {
                english: english_text,
                translated: translated_text,
                warning: secondary_warnings.join("; "),
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
fn auto_save_transcript(
    entries: Vec<TranscriptEntry>,
    output_dir: Option<String>,
) -> Result<ExportResponse, String> {
    if entries.is_empty() {
        return Ok(ExportResponse {
            ok: false,
            path: None,
            message: Some("No transcript entries to auto-save.".to_string()),
        });
    }

    let sessions_dir = if let Some(dir) = output_dir {
        let trimmed = dir.trim();
        if trimmed.is_empty() {
            let home_dir =
                std::env::var("HOME").map_err(|_| "Could not locate HOME directory.".to_string())?;
            std::path::Path::new(&home_dir)
                .join("Desktop")
                .join("ChurchTranslateSessions")
        } else {
            PathBuf::from(trimmed)
        }
    } else {
        let home_dir =
            std::env::var("HOME").map_err(|_| "Could not locate HOME directory.".to_string())?;
        std::path::Path::new(&home_dir)
            .join("Desktop")
            .join("ChurchTranslateSessions")
    };

    fs::create_dir_all(&sessions_dir)
        .map_err(|e| format!("Failed to create session folder: {e}"))?;

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
fn pick_auto_save_folder() -> Result<Option<String>, String> {
    let selected = rfd::FileDialog::new().pick_folder();
    Ok(selected.map(|path| path.display().to_string()))
}

#[tauri::command]
fn pick_test_audio_file() -> Result<Option<PickedTestAudioFileResponse>, String> {
    let selected = rfd::FileDialog::new()
        .add_filter(
            "Audio files",
            &[
                "wav", "mp3", "m4a", "aac", "flac", "ogg", "opus", "oga", "webm", "mpeg",
                "mpga", "aif", "aiff", "wma",
            ],
        )
        .pick_file();

    let Some(path) = selected else {
        return Ok(None);
    };

    let bytes = fs::read(&path).map_err(|e| format!("Failed to read selected audio file: {e}"))?;
    let name = path
        .file_name()
        .and_then(|v| v.to_str())
        .unwrap_or("test-audio")
        .to_string();
    let mime_type = mime_from_audio_extension(&path);

    Ok(Some(PickedTestAudioFileResponse {
        name,
        mime_type,
        bytes_base64: base64::engine::general_purpose::STANDARD.encode(bytes),
    }))
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
        .title("")
        .inner_size(1280.0, 720.0)
        .resizable(true)
        .decorations(true)
        .title_bar_style(TitleBarStyle::Overlay)
        .hidden_title(true)
        .shadow(true)
        .background_color(Color(4, 13, 29, 255));

    builder
        .build()
        .map_err(|e| format!("Failed to open output window: {e}"))?;

    Ok(OkResponse { ok: true })
}

#[tauri::command]
fn push_output_caption(
    payload: OutputCaptionPayload,
    app: tauri::AppHandle,
    state: tauri::State<AppState>,
) -> Result<PushOutputCaptionResponse, String> {
    if let Ok(mut latest) = state.latest_output_caption.lock() {
        *latest = Some(payload.clone());
    }
    if let Some(window) = app.get_webview_window("output") {
        let payload_json = serde_json::to_string(&payload)
            .map_err(|e| format!("Failed to serialize output payload: {e}"))?;
        let emitted = window.emit("output-caption", payload).is_ok();
        let eval_delivered = window
            .eval(&format!(
                "window.__applyOutputCaption && window.__applyOutputCaption({payload_json});"
            ))
            .is_ok();
        return Ok(PushOutputCaptionResponse {
            ok: true,
            delivered: emitted || eval_delivered,
        });
    }
    Ok(PushOutputCaptionResponse {
        ok: true,
        delivered: false,
    })
}

#[tauri::command]
fn is_output_window_open(app: tauri::AppHandle) -> Result<bool, String> {
    Ok(app.get_webview_window("output").is_some())
}

#[tauri::command]
fn notify_output_window_state(state: String, app: tauri::AppHandle) -> Result<OkResponse, String> {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.emit("output-window-state", OutputWindowStatePayload { state });
    }
    Ok(OkResponse { ok: true })
}

#[tauri::command]
fn get_latest_output_caption(
    state: tauri::State<AppState>,
) -> Result<Option<OutputCaptionPayload>, String> {
    match state.latest_output_caption.lock() {
        Ok(latest) => Ok(latest.clone()),
        Err(_) => Ok(None),
    }
}

#[tauri::command]
fn start_dragging_window(window: tauri::WebviewWindow) -> Result<OkResponse, String> {
    window
        .start_dragging()
        .map_err(|e| format!("Failed to start window dragging: {e}"))?;
    Ok(OkResponse { ok: true })
}

#[tauri::command]
fn control_window(action: String, window: tauri::WebviewWindow) -> Result<OkResponse, String> {
    match action.as_str() {
        "minimize" => window
            .minimize()
            .map_err(|e| format!("Failed to minimize window: {e}"))?,
        "toggle_maximize" => {
            let is_maximized = window
                .is_maximized()
                .map_err(|e| format!("Failed to read maximize state: {e}"))?;
            if is_maximized {
                window
                    .unmaximize()
                    .map_err(|e| format!("Failed to unmaximize window: {e}"))?;
            } else {
                window
                    .maximize()
                    .map_err(|e| format!("Failed to maximize window: {e}"))?;
            }
        }
        "toggle_maximize_restore_launch_size" => {
            let is_maximized = window
                .is_maximized()
                .map_err(|e| format!("Failed to read maximize state: {e}"))?;
            if is_maximized {
                window
                    .unmaximize()
                    .map_err(|e| format!("Failed to unmaximize window: {e}"))?;
                let launch_size = if window.label() == "output" {
                    Some(LogicalSize::new(1280.0, 720.0))
                } else if window.label() == "main" {
                    Some(LogicalSize::new(1500.0, 920.0))
                } else {
                    None
                };
                if let Some(size) = launch_size {
                    window.set_size(Size::Logical(size)).map_err(|e| {
                        format!(
                            "Failed to restore {} window launch size: {e}",
                            window.label()
                        )
                    })?;
                }
            } else {
                window
                    .maximize()
                    .map_err(|e| format!("Failed to maximize window: {e}"))?;
            }
        }
        "close" => window
            .close()
            .map_err(|e| format!("Failed to close window: {e}"))?,
        _ => return Err(format!("Unknown window action: {action}")),
    }
    Ok(OkResponse { ok: true })
}

pub fn run() {
    tauri::Builder::default()
        .menu(|app| {
            #[cfg(target_os = "macos")]
            {
                let pkg_info = app.package_info();
                let config = app.config();
                let app_name = "Church Live Translate";
                let short_version = pkg_info
                    .version
                    .to_string()
                    .split('.')
                    .take(2)
                    .collect::<Vec<_>>()
                    .join(".");
                let app_copyright = config
                    .bundle
                    .copyright
                    .clone()
                    .unwrap_or_else(|| format!("© {} {}", Utc::now().year(), app_name));
                let about_metadata = AboutMetadata {
                    name: Some(app_name.to_string()),
                    version: Some(pkg_info.version.to_string()),
                    short_version: Some(short_version),
                    copyright: Some(app_copyright),
                    credits: Some(
                        "Audio → Source Transcript → Target Translation for live church services."
                            .to_string(),
                    ),
                    authors: config.bundle.publisher.clone().map(|p| vec![p]),
                    icon: app.default_window_icon().cloned(),
                    ..Default::default()
                };

                let app_menu = SubmenuBuilder::new(app, app_name)
                    .about_with_text(format!("About {app_name}"), Some(about_metadata))
                    .separator()
                    .services()
                    .separator()
                    .hide_with_text(format!("Hide {app_name}"))
                    .hide_others()
                    .show_all()
                    .separator()
                    .quit_with_text(format!("Quit {app_name}"))
                    .build()?;

                let file_menu = SubmenuBuilder::new(app, "File").close_window().build()?;
                let edit_menu = SubmenuBuilder::new(app, "Edit")
                    .undo()
                    .redo()
                    .separator()
                    .cut()
                    .copy()
                    .paste()
                    .select_all()
                    .build()?;
                let view_menu = SubmenuBuilder::new(app, "View").fullscreen().build()?;
                let window_menu = SubmenuBuilder::new(app, "Window")
                    .minimize()
                    .maximize()
                    .separator()
                    .close_window()
                    .build()?;
                let help_menu = SubmenuBuilder::new(app, "Help").build()?;

                Menu::with_items(
                    app,
                    &[
                        &app_menu,
                        &file_menu,
                        &edit_menu,
                        &view_menu,
                        &window_menu,
                        &help_menu,
                    ],
                )
            }
            #[cfg(not(target_os = "macos"))]
            {
                Menu::default(app)
            }
        })
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(log::LevelFilter::Info)
                .targets([
                    Target::new(TargetKind::LogDir {
                        file_name: Some("app".into()),
                    }),
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
            stt_keywords: Mutex::new(String::new()),
            sermon_stt_keywords: Mutex::new(String::new()),
            reference_script: Mutex::new(String::new()),
            target_language: Mutex::new("zh-hans".to_string()),
            source_language: Mutex::new("korean".to_string()),
            asr_quality_preset: Mutex::new("balanced".to_string()),
            rolling_english_context: Mutex::new(String::new()),
            rolling_source_context: Mutex::new(String::new()),
            latest_output_caption: Mutex::new(None),
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
            pick_auto_save_folder,
            pick_test_audio_file,
            import_glossary,
            export_glossary,
            toggle_output_window,
            push_output_caption,
            is_output_window_open,
            notify_output_window_state,
            get_latest_output_caption,
            start_dragging_window,
            control_window
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
