## ADDED Requirements

### Requirement: Backup automático antes de migrar

El sistema DEBE crear un backup de la base de datos antes de ejecutar migraciones en producción.

#### Scenario: Backup antes de migración

- **WHEN** runMigrations() se ejecuta en producción
- **THEN** DEBE crear un archivo de backup en la carpeta backups/

### Requirement: Rotación de backups

El sistema DEBE mantener solo los últimos 5 backups, eliminando los más antiguos.

#### Scenario: Más de 5 backups

- **WHEN** se crea un nuevo backup y ya existen 5 o más
- **THEN** DEBE eliminar el backup más antiguo

#### Scenario: Menos de 5 backups

- **WHEN** se crea un nuevo backup y existen menos de 5
- **THEN** DEBE mantener todos los backups existentes

### Requirement: Formato de nombre de backup

El sistema DEBE usar un formato consistente para los nombres de backup.

#### Scenario: Nombre de backup

- **WHEN** se crea un backup
- **THEN** DEBE usar el formato: app_custos_backup_YYYYMMDD_HHmmss.db

### Requirement: Ubicación de backups

El sistema DEBE almacenar los backups en el directorio userData de la aplicación.

#### Scenario: Directorio de backups

- **WHEN** se crea un backup
- **THEN** DEBE guardarse en: %APPDATA%/CustosERP/backups/
