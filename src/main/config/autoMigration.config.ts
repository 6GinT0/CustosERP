import { app } from 'electron'
import { execaCommand } from 'execa'
import path from 'path'
import { createBackup, listBackups } from '../lib/backup'

const MAX_RETRIES = 3
const RETRY_DELAY = 2000

export async function runMigrations(): Promise<void> {
  const isProd = app.isPackaged

  console.log('[Migration] Verificando base de datos...')

  if (!isProd) {
    console.log('[Migration] Desarrollo: ejecutando prisma db push en background...')

    execaCommand('npx prisma db push', {
      cwd: process.cwd(),
      timeout: 30000
    })
      .then(() => {
        console.log('[Migration] Schema sincronizado correctamente')
      })
      .catch((err) => {
        console.error('[Migration] Error:', err.message)
      })

    return
  }

  console.log('[Migration] Producción: aplicando migraciones...')

  const backupPath = createBackup()
  if (backupPath) {
    console.log('[Migration] Backup creado antes de migración:', backupPath)
  }

  const dbPath = app.getPath('userData')
  const dbUrl = `file:${path.join(dbPath, 'app_custos.db')}`

  console.log('[Migration] Database path:', dbPath)

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`[Migration] Intento ${attempt}/${MAX_RETRIES}...`)

    try {
      console.log('[Migration] Ejecutando migrate deploy...')

      await execaCommand('npx prisma migrate deploy', {
        cwd: process.cwd(),
        timeout: 60000,
        env: {
          ...process.env,
          DATABASE_URL: dbUrl
        }
      })

      console.log('[Migration] Migraciones aplicadas correctamente')
      return
    } catch (error: any) {
      console.error(`[Migration] Error en intento ${attempt}:`, error.message)

      if (attempt < MAX_RETRIES) {
        console.log(`[Migration] Reintentando en ${RETRY_DELAY}ms...`)
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      }
    }
  }

  console.log('[Migration] Intentando con db push como fallback...')

  try {
    await execaCommand('npx prisma db push', {
      cwd: process.cwd(),
      timeout: 60000,
      env: {
        ...process.env,
        DATABASE_URL: dbUrl
      }
    })
    console.log('[Migration] Schema sincronizado con db push')
  } catch (error: any) {
    console.error('[Migration] Error en fallback:', error.message)
    console.log('[Migration] Backups disponibles:', listBackups())
  }
}
