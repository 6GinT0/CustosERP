import { app } from 'electron'
import path from 'path'
import { ensureBackupDir } from '../lib/backup'

export function initDatabase(): void {
  const isProd = app.isPackaged
  let dbPath: string

  if (!isProd) {
    dbPath = path.join(process.cwd(), 'dev.db')
  } else {
    const userDataPath = app.getPath('userData')
    dbPath = path.join(userDataPath, 'app_custos.db')
    ensureBackupDir()
  }

  process.env.DATABASE_URL = `file:${dbPath}`
  console.log('[DB] DATABASE_URL configurada:', process.env.DATABASE_URL)
}

export function getDatabasePath(): string {
  const isProd = app.isPackaged
  return isProd
    ? path.join(app.getPath('userData'), 'app_custos.db')
    : path.join(process.cwd(), 'dev.db')
}
