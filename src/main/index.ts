import 'dotenv/config'

import { app, shell, BrowserWindow, ipcMain, protocol, nativeImage, dialog } from 'electron'
import { join, resolve } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { runMigrations } from './config/autoMigration.config'
import { initDatabase } from './config/db.config'
import { initAutoUpdater } from './config/autoUpdater.config'

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db'
}

protocol.registerSchemesAsPrivileged([
  { scheme: 'app-data', privileges: { secure: true, standard: true, supportFetchAPI: true } }
])

const isLock = app.requestSingleInstanceLock()

if (!isLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 0) {
      if (windows[0].isMinimized()) windows[0].restore()
      windows[0].focus()
    }
  })
}

process.on('uncaughtException', (error) => {
  console.error('[MAIN] Uncaught Exception:', error)
  dialog.showErrorBox(
    'Error Crítico en CustosERP',
    `Ocurrió un error inesperado:\n${error.message}\n\nPor favor, contactá al desarrollador.`
  )
  app.quit()
})

process.on('unhandledRejection', (reason) => {
  console.error('[MAIN] Unhandled Rejection:', reason)
})

function createWindow(): void {
  console.log('[MAIN] Creando ventana...')

  const mainWindow = new BrowserWindow({
    minWidth: 900,
    minHeight: 670,
    show: false,
    autoHideMenuBar: true,
    icon: nativeImage.createFromPath(icon),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url)
    }

    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

import { registerTaxonomyHandlers } from './ipc/taxonomy.ipc'
import { registerCategoryHandlers } from './ipc/category.ipc'
import { registerCategoryItemHandlers } from './ipc/category-item.ipc'
import { registerCompanyHandlers } from './ipc/company.ipc'
import { registerProfessionalHandlers } from './ipc/professional.ipc'
import { registerInspectionHandlers } from './ipc/inspection.ipc'
import { registerInspectionResultHandlers } from './ipc/inspection-result.ipc'
import { registerPdfHandlers } from './ipc/pdf.ipc'

app.whenReady().then(async () => {
  console.log('[MAIN] App ready, iniciando...')

  electronApp.setAppUserModelId('com.6gint0.custoserp')

  console.log('[MAIN] Iniciando database...')
  initDatabase()

  console.log('[MAIN] Ejecutando migraciones...')
  await runMigrations()

  console.log('[MAIN] Iniciando autoUpdater...')
  initAutoUpdater()

  console.log('[MAIN] Registrando protocolo app-data...')
  protocol.registerFileProtocol('app-data', (request, callback) => {
    const rawPath = decodeURIComponent(request.url.replace(/^app-data:\/\//, ''))
    const pathPart = rawPath.replace(/^\/+/, '').replace(/\\/g, '/')

    let baseDir: string
    if (is.dev) {
      baseDir = resolve(process.cwd(), 'storage')
    } else {
      baseDir = join(app.getPath('userData'), 'storage')
    }

    const fullPath = resolve(baseDir, pathPart)
    callback({ path: fullPath })
  })

  console.log('[MAIN] Configurando optimizador...')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  console.log('[MAIN] Registrando handlers IPC...')
  registerTaxonomyHandlers()
  registerCategoryHandlers()
  registerCategoryItemHandlers()
  registerCompanyHandlers()
  registerProfessionalHandlers()
  registerInspectionHandlers()
  registerInspectionResultHandlers()
  registerPdfHandlers()

  console.log('[MAIN] Creando ventana principal...')
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  console.log('[MAIN] Todas las ventanas cerradas')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
