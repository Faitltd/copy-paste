use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};
use tauri_plugin_log::LogTarget;
use tauri_plugin_positioner::{Position, WindowExt};
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

#[cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#[tauri::command]
fn frontend_log(level: String, message: String, details: Option<String>) {
    let details = details.unwrap_or_default();
    match level.as_str() {
        "debug" => log::debug!("{message}\n{details}"),
        "info" => log::info!("{message}\n{details}"),
        "warn" => log::warn!("{message}\n{details}"),
        _ => log::error!("{message}\n{details}"),
    }
}

fn main() {
    let show_hide = CustomMenuItem::new("toggle".to_string(), "Show/Hide");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit Pasta");
    let system_tray_menu = SystemTrayMenu::new()
        .add_item(show_hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard::init())
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::LogDir, LogTarget::Stdout])
                .build(),
        )
        .plugin(tauri_plugin_positioner::init())
        .system_tray(SystemTray::new().with_menu(system_tray_menu))
        .on_system_tray_event(|app, event| {
            tauri_plugin_positioner::on_tray_event(app, &event);
            let toggle_window = || {
                if let Some(window) = app.get_window("main") {
                    let _ = window.move_window(Position::Center);
                    if window.is_visible().unwrap_or(false) {
                        let _ = window.hide();
                    } else {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
            };
            match event {
                SystemTrayEvent::LeftClick {
                    position: _,
                    size: _,
                    ..
                } => {
                    toggle_window();
                }
                SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                    "toggle" => toggle_window(),
                    "quit" => app.exit(0),
                    _ => {}
                },
                _ => {}
            }
        })
        .on_window_event(|event| {
            if let tauri::WindowEvent::Focused(is_focused) = event.event() {
                if !is_focused {
                    let _ = event.window().hide();
                }
            }
        })
        .setup(|app| {
            // Ensure panics end up in the log file as well as stderr.
            let default_hook = std::panic::take_hook();
            std::panic::set_hook(Box::new(move |panic_info| {
                let backtrace = std::backtrace::Backtrace::force_capture();
                log::error!("panic: {panic_info}\n{backtrace}");
                default_hook(panic_info);
            }));

            log::info!("app starting");

            let window = app.get_window("main").unwrap();
            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![frontend_log])
        .run(context)
        .expect("error while running tauri application");
}
