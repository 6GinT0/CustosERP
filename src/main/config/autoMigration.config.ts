import { app } from 'electron'
import path from 'path'
import { createBackup, listBackups } from '../lib/backup'
import { getPrisma } from '../lib/prisma'

const MAX_RETRIES = 3
const RETRY_DELAY = 2000

export async function runMigrations(): Promise<void> {
  const isProd = app.isPackaged

  console.log('[Migration] Verificando base de datos...')

  if (!isProd) {
    console.log('[Migration] Desarrollo: omitiendo migración automática en dev mode')
    return
  }

  console.log('[Migration] Producción: aplicando migraciones con PrismaClient...')

  const backupPath = createBackup()
  if (backupPath) {
    console.log('[Migration] Backup creado antes de migración:', backupPath)
  }

  const dbPath = app.getPath('userData')
  const dbUrl = `file:${path.join(dbPath, 'app_custos.db')}`

  console.log('[Migration] Database path:', dbPath)

  process.env.DATABASE_URL = dbUrl

  const prisma = getPrisma()

  // Fix for previous bug: rename columns if they use snake_case
  const tables = ['companies', 'professionals', 'taxonomies', 'categories', 'category_items', 'inspections']
  for (const table of tables) {
    try {
      const info: any[] = await prisma.$queryRawUnsafe(`PRAGMA table_info(${table})`)
      const hasCreatedAt = info.some((c) => c.name === 'createdAt')
      const hasOldCreatedAt = info.some((c) => c.name === 'created_at')

      if (!hasCreatedAt && hasOldCreatedAt) {
        console.log(`[Migration] Renombrando created_at a createdAt en ${table}`)
        await prisma.$executeRawUnsafe(`ALTER TABLE ${table} RENAME COLUMN created_at TO createdAt`)
      }

      const hasUpdatedAt = info.some((c) => c.name === 'updatedAt')
      const hasOldUpdatedAt = info.some((c) => c.name === 'updated_at')

      if (!hasUpdatedAt && hasOldUpdatedAt) {
        console.log(`[Migration] Renombrando updated_at a updatedAt en ${table}`)
        await prisma.$executeRawUnsafe(`ALTER TABLE ${table} RENAME COLUMN updated_at TO updatedAt`)
      }
    } catch (e) {
      // Table might not exist yet, skip
    }
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`[Migration] Intento ${attempt}/${MAX_RETRIES}...`)

    try {
      console.log('[Migration] Ejecutando prisma.$executeRawUnsafe para crear tablas...')

      const prisma = getPrisma()

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS companies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cuit TEXT UNIQUE NOT NULL,
          social_reason TEXT,
          social_number INTEGER,
          fantasy_name TEXT UNIQUE NOT NULL,
          address TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          phone TEXT,
          contact_name TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS professionals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fullname TEXT NOT NULL,
          tuition_number TEXT UNIQUE NOT NULL,
          signature_path TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS taxonomies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          name TEXT NOT NULL,
          normalized_name TEXT UNIQUE NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          normalized_name TEXT UNIQUE NOT NULL,
          description TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS category_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          normalized_name TEXT UNIQUE NOT NULL,
          law_reference TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        )
      `)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS inspections (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date DATETIME DEFAULT CURRENT_TIMESTAMP,
          company_id INTEGER NOT NULL,
          professional_id INTEGER NOT NULL,
          area_id INTEGER NOT NULL,
          sector_id INTEGER NOT NULL,
          reason_id INTEGER NOT NULL,
          art TEXT NOT NULL,
          work_schedule TEXT,
          total_visits_count INTEGER DEFAULT 0,
          total_inspections_count INTEGER DEFAULT 0,
          current_employee_count INTEGER,
          observations TEXT,
          breach TEXT,
          signature_customer_path TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (company_id) REFERENCES companies(id),
          FOREIGN KEY (professional_id) REFERENCES professionals(id),
          FOREIGN KEY (area_id) REFERENCES taxonomies(id),
          FOREIGN KEY (sector_id) REFERENCES taxonomies(id),
          FOREIGN KEY (reason_id) REFERENCES taxonomies(id)
        )
      `)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS inspection_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          inspection_id INTEGER NOT NULL,
          category_item_id INTEGER NOT NULL,
          status TEXT NOT NULL,
          item_snapshot TEXT,
          FOREIGN KEY (inspection_id) REFERENCES inspections(id) ON DELETE CASCADE,
          FOREIGN KEY (category_item_id) REFERENCES category_items(id)
        )
      `)

      console.log('[Migration] Tablas creadas correctamente')

      // Seed essential data if tables are empty
      console.log('[Migration] Verificando datos esenciales...')

      await prisma.$executeRawUnsafe(`
        INSERT OR IGNORE INTO taxonomies (type, name, normalized_name, updatedAt) VALUES
        ('AREA', 'lanús', 'lanus', datetime('now')),
        ('AREA', 'avellaneda', 'avellaneda', datetime('now')),
        ('SECTOR', 'almacén', 'almacen', datetime('now')),
        ('SECTOR', 'carniceria', 'carniceria', datetime('now')),
        ('SECTOR', 'deportes', 'deportes', datetime('now')),
        ('SECTOR', 'electrodomésticos', 'electrodomesticos', datetime('now')),
        ('SECTOR', 'entretenimientos', 'entretenimientos', datetime('now')),
        ('SECTOR', 'fiambrería', 'fiambreria', datetime('now')),
        ('SECTOR', 'heladería', 'heladeria', datetime('now')),
        ('SECTOR', 'hiper', 'hiper', datetime('now')),
        ('SECTOR', 'joyería', 'joyeria', datetime('now')),
        ('SECTOR', 'kiosco', 'kiosco', datetime('now')),
        ('SECTOR', 'marroquinería', 'marroquineria', datetime('now')),
        ('SECTOR', 'mayorista', 'mayorista', datetime('now')),
        ('SECTOR', 'polirubro', 'polirubro', datetime('now')),
        ('SECTOR', 'ropa', 'ropa', datetime('now')),
        ('SECTOR', 'super', 'super', datetime('now')),
        ('SECTOR', 'tecnología', 'tecnologia', datetime('now')),
        ('SECTOR', 'verdulería', 'verduleria', datetime('now')),
        ('SECTOR', 'vivero', 'vivero', datetime('now')),
        ('SECTOR', 'telas', 'telas', datetime('now')),
        ('SECTOR', 'bebidas', 'bebidas', datetime('now')),
        ('REASON', 'delegado', 'delegado', datetime('now')),
        ('REASON', 'denuncia', 'denuncia', datetime('now')),
        ('REASON', 'fiscalizador', 'fiscalizador', datetime('now')),
        ('REASON', 'secretario', 'secretario', datetime('now')),
        ('REASON', 'secretario externo', 'secretario externo', datetime('now')),
        ('REASON', 'zona', 'zona', datetime('now'))
      `)

      await prisma.$executeRawUnsafe(`
        INSERT OR IGNORE INTO categories (id, name, normalized_name, updatedAt) VALUES 
        (1, 'ninguno', 'ninguno', datetime('now')), 
        (2, 'seguridad eléctrica', 'seguridad electrica', datetime('now')), 
        (3, 'seguridad contra incendio', 'seguridad contra incendio', datetime('now')), 
        (4, 'sector de almacenamiento (escaleras, entrepisos, estanterías, elevadores)', 'sector de almacenamiento (escaleras, entrepisos, estanterias, elevadores)', datetime('now')), 
        (5, 'temas varios (servicio del personal, epp, ropa, etc.)', 'temas varios (servicio del personal, epp, ropa, etc.)', datetime('now'))
      `)

      await prisma.$executeRawUnsafe(`
        INSERT OR IGNORE INTO category_items (category_id, name, law_reference, normalized_name, updatedAt) VALUES 
        (1, 'condiciones edilicias seguras', 'D351/79', 'condiciones edilicias seguras', datetime('now')),
        (1, 'instalaciones eléctricas en condiciones seguras', 'D351/79 - C14-A6', 'instalaciones electricas en condiciones seguras', datetime('now')),
        (2, 'dispositivo diferencial (disyuntor)', 'C14-A6 Y R900/15', 'dispositivo diferencial (disyuntor)', datetime('now')),
        (2, 'equipos y maquinarias seguras', '103', 'equipos y maquinarias seguras', datetime('now')),
        (3, 'capacitación en seguridad contra incendio', '208', 'capacitacion en seguridad contra incendio', datetime('now')),
        (3, 'presenta estudio de carga de fuego vigente', '176', 'presenta estudio de carga de fuego vigente', datetime('now')),
        (3, 'matafuegos accesibles y con carga vigente', '176', 'matafuegos accesibles y con carga vigente', datetime('now')),
        (3, 'cuenta con detectores de incendio / alarmas, etc.', 'C18 Y A7', 'cuenta con detectores de incendio / alarmas, etc.', datetime('now')),
        (3, 'posee cartel de salida de emergencia', '172', 'posee cartel de salida de emergencia', datetime('now')),
        (3, 'posee luz de emergencia en condiciones de uso', '76', 'posee luz de emergencia en condiciones de uso', datetime('now')),
        (3, 'las salidas y pasillos se encuentran liberados', '172', 'las salidas y pasillos se encuentran liberados', datetime('now')),
        (4, 'escaleras fijas segura (pasamanos y antideslizantes)', 'D351/79', 'escaleras fijas segura (pasamanos y antideslizantes)', datetime('now')),
        (4, 'escaleras móviles en condiciones seguras de uso', 'D351/79', 'escaleras moviles en condiciones seguras de uso', datetime('now')),
        (4, 'entrepiso con baranda y escalera segura', 'D351/79', 'entrepiso con baranda y escalera segura', datetime('now')),
        (4, 'almacenamiento seguro en estibas y estanterías', 'D351/79', 'almacenamiento seguro en estibas y estanterias', datetime('now')),
        (4, 'montacargas en condiciones seguras', '137', 'montacargas en condiciones seguras', datetime('now')),
        (4, 'elevadores de carga en condiciones seguras', '134 Y R960/15', 'elevadores de carga en condiciones seguras', datetime('now')),
        (4, 'buen orden y limpieza general', NULL, 'buen orden y limpieza general', datetime('now')),
        (5, 'tiene botiquín de primeros auxilios', 'C51', 'tiene botiquin de primeros auxilios', datetime('now')),
        (5, 'capacitación en temas de seguridad laboral', '208', 'capacitacion en temas de seguridad laboral', datetime('now')),
        (5, 'baños en buenas condiciones higiénicas', 'C53', 'baños en buenas condiciones higienicas', datetime('now')),
        (5, 'los vestuarios y comedor cumplen con el cct', 'C64', 'los vestuarios y comedor cumplen con el cct', datetime('now')),
        (5, 'se realiza la entrada de ropa según cct y d351/79', 'CCT C9 Y D351/79', 'se realiza la entrada de ropa segun cct y d351/79', datetime('now')),
        (5, 'se realiza la entrada de los epp correspondientes', 'CCT C9 Y D351/79', 'se realiza la entrada de los epp correspondientes', datetime('now')),
        (5, 'existen carteles de obligaciones y advertencia', 'D351/79', 'existen carteles de obligaciones y advertencia', datetime('now')),
        (5, 'provisión de agua potable con análisis b y fq', 'D351/79 ART. 57', 'provision de agua potable con analisis b y fq', datetime('now')),
        (5, 'bebederos de agua, en buen estado de higiene', 'D351/79 - C6', 'bebederos de agua, en buen estado de higiene', datetime('now')),
        (5, 'pisos en condiciones seguras', 'D351/79', 'pisos en condiciones seguras', datetime('now')),
        (5, 'confort laboral, calefacción, ventilación, etc.', 'D351/79 C11 Y 12', 'confort laboral, calefaccion, ventilacion, etc.', datetime('now')),
        (5, 'mobiliario o equipos propios del local en buen estado', 'D351/79', 'mobiliario o equipos propios del local en buen estado', datetime('now'))
      `)

      console.log('[Migration] Datos esenciales verificados/insertados')
      return
    } catch (error: any) {
      console.error(`[Migration] Error en intento ${attempt}:`, error.message)

      if (attempt < MAX_RETRIES) {
        console.log(`[Migration] Reintentando en ${RETRY_DELAY}ms...`)
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      }
    }
  }

  console.log('[Migration] Error: No se pudieron crear las tablas después de múltiples intentos')
  console.log('[Migration] Backups disponibles:', listBackups())
}
