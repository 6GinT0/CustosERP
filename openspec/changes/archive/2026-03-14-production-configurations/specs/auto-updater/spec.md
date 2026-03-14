## ADDED Requirements

### Requirement: Auto-updater busca actualizaciones en cada inicio

El sistema DEBE verificar si hay actualizaciones disponibles cada vez que la aplicación se inicia en modo producción.

#### Scenario: Update disponible al iniciar

- **WHEN** la aplicación se inicia en modo producción (app.isPackaged = true)
- **THEN** electron-updater DEBE verificar GitHub Releases automáticamente

#### Scenario: No hay update disponible

- **WHEN** no hay nueva versión en GitHub Releases
- **THEN** la aplicación DEBE iniciar normalmente sin mostrar mensajes

### Requirement: Auto-updater notifica al usuario cuando hay update

El sistema DEBE mostrar un diálogo al usuario cuando una actualización ha sido descargada.

#### Scenario: Update descargado exitosamente

- **WHEN** electron-updater completa la descarga del update
- **THEN** DEBE mostrar un diálogo con opciones "Reiniciar ahora" y "Más tarde"

#### Scenario: Usuario acepta instalar update

- **WHEN** el usuario hace clic en "Reiniciar ahora"
- **THEN** la aplicación DEBE cerrar e instalar la nueva versión automáticamente

#### Scenario: Usuario pospone update

- **WHEN** el usuario hace clic en "Más tarde"
- **THEN** la aplicación DEBE continuar funcionando normalmente

### Requirement: Auto-updater solo ejecuta en producción

El sistema NO DEBE intentar buscar actualizaciones cuando se ejecuta en modo desarrollo.

#### Scenario: Modo desarrollo

- **WHEN** la aplicación se inicia con npm run dev
- **THEN** electron-updater DEBE omitir la verificación de updates

### Requirement: Auto-updater usa solo releases estables

El sistema DEBE ignorar pre-releases (beta, alpha) al buscar actualizaciones.

#### Scenario: Solo releases stable

- **WHEN** electron-updater verifica actualizaciones
- **THEN** DEBE considerar solo releases con tag "latest" en GitHub
