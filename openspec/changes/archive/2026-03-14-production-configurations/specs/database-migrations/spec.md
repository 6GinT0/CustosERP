## ADDED Requirements

### Requirement: Migraciones se ejecutan automáticamente al inicio

El sistema DEBE ejecutar las migraciones de Prisma cada vez que la aplicación se inicia en modo producción.

#### Scenario: Primera instalación

- **WHEN** la aplicación se instala por primera vez (no existe DB)
- **THEN** migrate deploy DEBE crear todas las tablas desde cero

#### Scenario: Actualización de versión

- **WHEN** se actualiza a una nueva versión con migraciones pendientes
- **THEN** migrate deploy DEBE aplicar solo las migraciones nuevas

#### Scenario: Sin migraciones pendientes

- **WHEN** la DB ya está actualizada (no hay migraciones pendientes)
- **THEN** el sistema DEBE continuar sin errores

### Requirement: Schema de Prisma incluido en el build

El sistema DEBE incluir el directorio prisma/ con schema y migraciones en los archivos de producción.

#### Scenario: Archivos necesarios en producción

- **WHEN** electron-builder genera el instalador
- **THEN** DEBE incluir: prisma/schema.prisma, prisma/migrations/_, node_modules/.prisma/client/_, node_modules/@prisma/engines/\*

### Requirement: Migraciones en desarrollo

El sistema DEBE ejecutar db push en modo desarrollo para sincronizar el schema.

#### Scenario: Modo desarrollo

- **WHEN** npm run dev se ejecuta
- **THEN** el sistema DEBE ejecutar prisma db push en background
