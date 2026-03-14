## Context

CustosERP es una aplicación Electron + Vue 3 que usa Prisma con SQLite. Actualmente no tiene configuraciones para producción, lo que impide distribuir actualizaciones automáticas a los usuarios.

**Estado actual:**

- DB: SQLite en archivo local `dev.db`
- Sin auto-updater configurado
- Sin sistema de backup
- electron-builder.yml incompleto para producción

**Restricciones:**

- Usar electron-updater con GitHub Releases (solo stable)
- Mantener compatibilidad con la versión actual de Prisma (7.4.2)
- Windows como objetivo principal

## Goals / Non-Goals

**Goals:**

- Auto-updater funcional que busque updates en cada inicio
- Migraciones automáticas que preserve datos entre versiones
- Sistema de backup con 5 rotaciones
- Build de producción funcional

**Non-Goals:**

- Actualizaciones delta (solo full updates)
- Canal beta/testing
- Migración a otra base de datos

## Decisions

### D1: Auto-updater con GitHub Releases

**Decisión:** Usar electron-updater con provider: github (ya configurado)
**Alternativas:** Servidor own update, squirrel.windows
**Rationale:** Integración nativa con electron-builder, sin servidor adicional

### D2: Estrategia de migraciones

**Decisión:** Usar `prisma migrate deploy` en producción
**Alternativas:** `prisma db push`
**Rationale:** migrate deploy es más seguro para producción, permite rollback y mantiene historial de migraciones

### D3: Ubicación de la DB

**Decisión:** `%APPDATA%/CustosERP/app_custos.db`
**Alternativas:** Dentro del bundle, en app.getPath('userData')
**Rationale:** userData es el estándar para datos persistentes de usuario

### D4: Backup antes de migración

**Decisión:** Crear backup automático antes de ejecutar migrate deploy
**Alternativas:** Sin backup, backup manual
**Rationale:** Protección contra migración fallida que deje la DB corrupta

## Risks / Trade-offs

**[R1]** → Migrations en Windows pueden fallar con path largos
**Mitigación:** Usar rutas relativas y короткие nombres

**[R2]** → El proceso de migración puede bloquear el inicio
**Mitigación:** Ejecutar migración de forma síncrona pero con timeout

**[R3]** → El usuario puede perder datos si no hay backup
**Mitigación:** Backup automático con rotación de 5 archivos

## Migration Plan

1. **Build actual** → genera .exe con archivos necesarios
2. **Primera instalación** → migrate deploy crea tablas
3. **Actualización v1.0.0 → v1.1.0**:
   - App detecta nueva versión disponible
   - Descarga en background
   - Usuario acepta reiniciar
   - App cierra, installer ejecuta
   - Nueva app inicia, migrate deploy aplica cambios
   - Datos preservados

## Open Questions

- ¿Confirmar que el repositorio GitHub está configurado para releases?
- ¿Hay algún dato sensible en la DB que requiera encriptación?
