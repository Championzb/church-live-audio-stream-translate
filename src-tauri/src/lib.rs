use tauri::Manager;

#[tauri::command]
fn ping() -> String {
    "ok".to_string()
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            let handle = app.handle();
            if let Some(window) = handle.get_webview_window("main") {
                let shortcut = tauri_plugin_global_shortcut::Shortcut::new(Some(
                    tauri_plugin_global_shortcut::Modifiers::empty(),
                ), tauri_plugin_global_shortcut::Code::F8);

                let _ = handle.global_shortcut().on_shortcut(shortcut, move |_app, _shortcut, _event| {
                    let _ = window.emit("toggle-from-hotkey", true);
                });
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![ping])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
