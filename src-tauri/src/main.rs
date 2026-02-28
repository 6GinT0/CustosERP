// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod migrations;

use std::fs;
use tauri::{AppHandle, Manager};

#[tauri::command]
async fn save_file(app: AppHandle, name: String, data: Vec<u8>) -> Result<String, String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let signatures_dir = app_dir.join("signatures");

    if !signatures_dir.exists() {
        fs::create_dir_all(&signatures_dir).map_err(|e| e.to_string())?;
    }

    let file_path = signatures_dir.join(name);
    fs::write(&file_path, data).map_err(|e| e.to_string())?;

    Ok(file_path.to_string_lossy().to_string())
}

fn main() {
    let migrations = vec![
        migrations::_1_initial_schema::MIGRATION_1,
        migrations::_2_initial_data_added::MIGRATION_2,
    ];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:app.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![save_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
