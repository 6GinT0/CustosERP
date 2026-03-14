import { dialog, app } from 'electron'
import { autoUpdater } from 'electron-updater'
import type { MessageBoxOptions } from 'electron'
import fs from 'fs'
import path from 'path'

function logToFile(message: string): void {
  const logDir = app.isPackaged ? app.getPath('userData') : process.cwd()
  const logFile = path.join(logDir, 'autoupdater.log')
  const timestamp = new Date().toISOString()

  try {
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`)
  } catch {
    console.error('[AutoUpdater] No se pudo escribir al log')
  }
}

export function initAutoUpdater(): void {
  console.log('[AutoUpdater] Iniciando configurador...')
  logToFile('Iniciando AutoUpdater')

  if (!app.isPackaged) {
    console.log('[AutoUpdater] Modo desarrollo, omitiendo verificación')
    logToFile('Modo desarrollo - omitiendo')
    return
  }

  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('checking-for-update', () => {
    console.log('[AutoUpdater] Buscando actualizaciones...')
    logToFile('Buscando actualizaciones...')
  })

  autoUpdater.on('update-available', (info) => {
    console.log('[AutoUpdater] Actualización disponible:', info.version)
    logToFile(`Actualización disponible: ${info.version}`)
  })

  autoUpdater.on('update-not-available', (info) => {
    console.log('[AutoUpdater] Ya tienes la última versión:', info.version)
    logToFile(`Sin actualizaciones. Versión actual: ${info.version}`)
  })

  autoUpdater.on('download-progress', (progressObj) => {
    const msg = `[AutoUpdater] Descargando: ${progressObj.percent.toFixed(1)}%`
    console.log(msg)
    logToFile(msg)
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log('[AutoUpdater] Actualización descargada:', info.version)
    logToFile(`Actualización descargada: ${info.version}`)

    const dialogOpts: MessageBoxOptions = {
      type: 'info',
      buttons: ['Reiniciar ahora', 'Más tarde'],
      title: 'Actualización lista',
      message: `Se descargó la versión ${info.version}. ¿Querés instalarla ahora para aplicar los cambios?`,
      detail: 'La aplicación se cerrará y se volverá a abrir automáticamente.'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) {
        logToFile('Usuario eligió reiniciar')
        autoUpdater.quitAndInstall()
      } else {
        logToFile('Usuario pospuso actualización')
      }
    })
  })

  autoUpdater.on('error', (error) => {
    console.error('[AutoUpdater] Error:', error.message)
    logToFile(`ERROR: ${error.message}`)
  })

  console.log('[AutoUpdater] Verificando actualizaciones...')
  logToFile('Ejecutando checkForUpdatesAndNotify')

  autoUpdater.checkForUpdatesAndNotify().catch((error) => {
    console.error('[AutoUpdater] Error al buscar actualizaciones:', error.message)
    logToFile(`Error en checkForUpdatesAndNotify: ${error.message}`)
  })
}
