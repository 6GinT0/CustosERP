## ADDED Requirements

### Requirement: Inicialización lazy de Prisma Client

El cliente de Prisma DEBE inicializarse de forma lazy (solo cuando se necesita) para asegurar que DATABASE_URL esté configurada antes de conectar a la base de datos.

#### Scenario: Prisma se inicializa después de DATABASE_URL

- **WHEN** se importa el módulo prisma.ts
- **THEN** NO debe intentar conectar a la base de datos inmediatamente
- **AND** DEBE esperar hasta que se realice la primera query

#### Scenario: Primera query usa DATABASE_URL correcta

- **WHEN** se ejecuta la primera query a la base de datos
- **AND** DATABASE_URL fue configurada por initDatabase()
- **THEN** DEBE usar la URL correcta para conectar

#### Scenario: DATABASE_URL no configurada

- **WHEN** se intenta usar Prisma sin llamar initDatabase()
- **THEN** DEBE lanzar un error descriptivo indicando que DATABASE_URL no está configurada
