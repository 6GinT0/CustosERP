import { app } from 'electron'
import fs from 'fs'
import path from 'path'

const DB_NAME = 'app_custos.db'
const BACKUP_DIR = 'backups'
const MAX_BACKUPS = 5

function getBackupDir(): string {
  const userDataPath = app.isPackaged ? app.getPath('userData') : path.join(process.cwd())
  return path.join(userDataPath, BACKUP_DIR)
}

function getDbPath(): string {
  const userDataPath = app.isPackaged ? app.getPath('userData') : process.cwd()
  return path.join(userDataPath, DB_NAME)
}

export function ensureBackupDir(): void {
  const backupDir = getBackupDir()
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
    console.log('[Backup] Directorio de backups creado:', backupDir)
  }
}

export function createBackup(): string | null {
  const dbPath = getDbPath()

  if (!fs.existsSync(dbPath)) {
    console.log('[Backup] No existe DB para respaldar:', dbPath)
    return null
  }

  ensureBackupDir()

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const backupName = `app_custos_backup_${timestamp}.db`
  const backupPath = path.join(getBackupDir(), backupName)

  try {
    fs.copyFileSync(dbPath, backupPath)
    console.log('[Backup] Backup creado:', backupPath)

    rotateBackups()

    return backupPath
  } catch (error) {
    console.error('[Backup] Error al crear backup:', error)
    return null
  }
}

export function rotateBackups(): void {
  const backupDir = getBackupDir()

  if (!fs.existsSync(backupDir)) {
    return
  }

  const files = fs
    .readdirSync(backupDir)
    .filter((f) => f.startsWith('app_custos_backup_') && f.endsWith('.db'))
    .map((f) => ({
      name: f,
      path: path.join(backupDir, f),
      time: fs.statSync(path.join(backupDir, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time)

  if (files.length > MAX_BACKUPS) {
    const toDelete = files.slice(MAX_BACKUPS)
    for (const file of toDelete) {
      fs.unlinkSync(file.path)
      console.log('[Backup] Backup antiguo eliminado:', file.name)
    }
  }
}

export function restoreFromBackup(backupPath: string): boolean {
  const dbPath = getDbPath()

  if (!fs.existsSync(backupPath)) {
    console.error('[Backup] Archivo de backup no encontrado:', backupPath)
    return false
  }

  try {
    fs.copyFileSync(backupPath, dbPath)
    console.log('[Backup] Restauración exitosa:', dbPath)
    return true
  } catch (error) {
    console.error('[Backup] Error al restaurar:', error)
    return false
  }
}

export function listBackups(): string[] {
  const backupDir = getBackupDir()

  if (!fs.existsSync(backupDir)) {
    return []
  }

  return fs
    .readdirSync(backupDir)
    .filter((f) => f.startsWith('app_custos_backup_') && f.endsWith('.db'))
    .sort()
    .reverse()
}
