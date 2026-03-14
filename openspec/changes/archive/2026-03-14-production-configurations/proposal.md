## Why

La aplicación CustosERP necesita configuraciones de producción para manejar actualizaciones automáticas, migraciones de base de datos y persistencia de datos entre versiones. Sin estas configuraciones, no es posible distribuir actualizaciones a los usuarios sin perder datos.

## What Changes

- Implementar módulo de backup automático de la base de datos SQLite
- Configurar auto-updater usando electron-updater con GitHub Releases
- Implementar migraciones automáticas de Prisma en producción
- Actualizar electron-builder.yml para incluir archivos necesarios de Prisma
- Persistir la base de datos en el directorio userData de la aplicación

## Capabilities

### New Capabilities

- **auto-updater**: Sistema de actualización automática que descarga e instala nuevas versiones desde GitHub Releases
- **database-migrations**: Migraciones automáticas de Prisma que mantienen la estructura de la DB entre versiones
- **backup-system**: Sistema de backup automático con rotación de 5 backups
- **production-persistence**: Persistencia de datos en producción usando app.getPath('userData')

### Modified Capabilities

- Ninguno - es una implementación nueva

## Impact

- **Archivos nuevos**: `src/main/lib/backup.ts`, `src/main/config/autoMigration.config.ts`, `src/main/config/autoUpdater.config.ts`, `src/main/config/db.config.ts`
- **Archivos modificados**: `electron-builder.yml`, `src/main/index.ts`
- **Dependencias**: electron-updater, @prisma/client
