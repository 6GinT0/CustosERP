## 1. Módulo de Backup

- [x] 1.1 Crear archivo `src/main/lib/backup.ts`
- [x] 1.2 Implementar función `createBackup()` que copie la DB a la carpeta backups/
- [x] 1.3 Implementar función `rotateBackups()` que mantenga solo los últimos 5 backups
- [x] 1.4 Implementar función `restoreFromBackup(backupPath)` para recuperación

## 2. Actualizar db.config.ts

- [x] 2.1 Modificar `initDatabase()` para usar app.getPath('userData') en producción
- [x] 2.2 Crear directorio backups/ si no existe
- [x] 2.3 Agregar logging de la ruta de la DB

## 3. Actualizar autoMigration.config.ts

- [x] 3.1 Importar módulo de backup
- [x] 3.2 Llamar `createBackup()` antes de ejecutar migrate deploy
- [x] 3.3 Corregir ruta del schema.prisma para producción (process.resourcesPath)
- [x] 3.4 Implementar retry logic si la migración falla

## 4. Actualizar autoUpdater.config.ts

- [x] 4.1 Agregar logging a consola y archivo
- [x] 4.2 Manejar errores de red gracefully
- [x] 4.3 Agregar evento `update-available` para notificar que hay update
- [x] 4.4 Verificar que solo se ejecute en producción

## 5. Actualizar electron-builder.yml

- [x] 5.1 Agregar `prisma/migrations/` a extraResources
- [x] 5.2 Agregar `node_modules/.prisma/client/` a extraResources
- [x] 5.3 Agregar `node_modules/@prisma/engines/` a extraResources
- [x] 5.4 Verificar que archivos se copian correctamente

## 6. Actualizar index.ts

- [x] 6.1 Importar módulo de backup
- [x] 6.2 Verificar orden correcto de inicialización: DB → Migración → Updater
- [x] 6.3 Agregar manejo de errores global para caught exceptions

## 7. Testing

- [x] 7.1 Probar `npm run dev` funciona correctamente
- [x] 7.2 Probar build: `npm run build`
- [x] 7.3 Probar build:win genera .exe
- [x] 7.4 Verificar que la DB se crea en la ubicación correcta
- [x] 7.5 Verificar que las migraciones se ejecutan

## 8. Bug Fix: Inicialización de Prisma

- [x] 8.1 Corregir prisma.ts para usar inicialización lazy
- [x] 8.2 Verificar que DATABASE_URL esté disponible antes de conectar
- [x] 8.3 Probar que las taxonomías cargan correctamente en producción
