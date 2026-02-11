use tauri_plugin_sql::{Migration, MigrationKind};

pub const MIGRATION_1: Migration = Migration {
    version: 1,
    description: "create_initial_tables",
    sql: "
        CREATE TABLE companies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cuit TEXT UNIQUE NOT NULL,
            social_reason TEXT,
            social_number TEXT,
            fantasy_name TEXT,
            address TEXT,
            latitude REAL,
            longitude REAL,
            phone TEXT,
            contact_name TEXT,
            total_visits_count INTEGER DEFAULT 0,
            total_inspections_count INTEGER DEFAULT 0
        );

        CREATE TABLE professionals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname TEXT NOT NULL,
            tuition_number TEXT,
            signature_path TEXT
        );

        CREATE TABLE taxonomies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL CHECK(type IN ('AREA', 'SECTOR', 'REASON')),
            name TEXT NOT NULL
        );

        CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
        );

        CREATE TABLE category_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            law_reference TEXT,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        );

        CREATE TABLE inspections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            company_id INTEGER NOT NULL,
            professional_id INTEGER NOT NULL,
            area_id INTEGER,
            sector_id INTEGER,
            reason_id INTEGER,
            art TEXT,
            work_schedule TEXT,
            current_employee_count INTEGER,
            observations TEXT,
            breach TEXT,
            signature_customer_path TEXT,
            FOREIGN KEY (company_id) REFERENCES companies(id),
            FOREIGN KEY (professional_id) REFERENCES professionals(id),
            FOREIGN KEY (area_id) REFERENCES taxonomies(id),
            FOREIGN KEY (sector_id) REFERENCES taxonomies(id),
            FOREIGN KEY (reason_id) REFERENCES taxonomies(id)
        );

        CREATE TABLE inspection_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            inspection_id INTEGER NOT NULL,
            category_item_id INTEGER NOT NULL,
            status INTEGER NOT NULL CHECK(status IN (0, 1, 2)), -- 0: N/A, 1: OK, 2: No OK
            item_snapshot TEXT,
            FOREIGN KEY (inspection_id) REFERENCES inspections(id) ON DELETE CASCADE,
            FOREIGN KEY (category_item_id) REFERENCES category_items(id)
        );
    ",
    kind: MigrationKind::Up,
};
