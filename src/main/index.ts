import { app, shell, BrowserWindow, ipcMain, protocol } from 'electron'
import { join, resolve } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// Register privileged schemes before app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app-data', privileges: { secure: true, standard: true, supportFetchAPI: true } }
])

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 900,
    minHeight: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
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

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Register protocol to serve storage files
  protocol.registerFileProtocol('app-data', (request, callback) => {
    // Decode and remove protocol prefix
    const rawPath = decodeURIComponent(request.url.replace(/^app-data:\/\//, ''))

    // Normalize path separators for Windows/Unix compatibility
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

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Registry Taxonomy Handlers
  registerTaxonomyHandlers()
  registerCategoryHandlers()
  registerCategoryItemHandlers()
  registerCompanyHandlers()
  registerProfessionalHandlers()
  registerInspectionHandlers()
  registerInspectionResultHandlers()
  registerPdfHandlers()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
