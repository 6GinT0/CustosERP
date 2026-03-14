## ADDED Requirements

### Requirement: Base de datos en userData

El sistema DEBE almacenar la base de datos SQLite en el directorio userData de Electron.

#### Scenario: Producción

- **WHEN** app.isPackaged = true
- **THEN** la DB DEBE estar en: %APPDATA%/CustosERP/app_custos.db

#### Scenario: Desarrollo

- **WHEN** app.isPackaged = false
- **THEN** la DB DEBE estar en: ./dev.db (directorio del proyecto)

### Requirement: DATABASE_URL configurada correctamente

El sistema DEBE establecer la variable DATABASE_URL antes de inicializar Prisma.

#### Scenario: Inicialización de DB

- **WHEN** initDatabase() se ejecuta
- **THEN** DEBE establecer process.env.DATABASE_URL con la ruta correcta

### Requirement: Directorio storage para archivos

El sistema DEBE configurar el protocolo app-data para servir archivos desde userData en producción.

#### Scenario: Protocolo app-data en producción

- **WHEN** la app está en producción
- **THEN** el directorio base DEBE ser: %APPDATA%/CustosERP/storage/

### Requirement: Datos persisten entre actualizaciones

El sistema DEBE mantener los datos de la base de datos cuando se actualiza a una nueva versión.

#### Scenario: Actualización de versión

- **WHEN** se instala una nueva versión de la aplicación
- **THEN** los datos existentes DEBEN preservarse (no se borra la DB)
