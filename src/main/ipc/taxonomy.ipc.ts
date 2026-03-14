import { ipcMain } from 'electron'
import { taxonomyService } from '../services/taxonomy.service'

export function registerTaxonomyHandlers(): void {
  ipcMain.handle('taxonomy:getAll', async () => {
    try {
      return await taxonomyService.getAll()
    } catch (error: any) {
      console.error('[IPC] Error en taxonomy:getAll:', error.message)
      throw error
    }
  })

  ipcMain.handle('taxonomy:getByType', async (_event, type) => {
    try {
      return await taxonomyService.getByType(type)
    } catch (error: any) {
      console.error(`[IPC] Error en taxonomy:getByType (${type}):`, error.message)
      throw error
    }
  })

  ipcMain.handle('taxonomy:create', async (_event, data) => {
    return taxonomyService.create(data)
  })

  ipcMain.handle('taxonomy:search', async (_event, query) => {
    return taxonomyService.search(query)
  })

  ipcMain.handle('taxonomy:update', async (_event, data) => {
    return taxonomyService.update(data)
  })

  ipcMain.handle('taxonomy:delete', async (_event, id) => {
    return taxonomyService.delete(id)
  })

  ipcMain.handle('taxonomy:deleteMany', async (_event, ids) => {
    return taxonomyService.deleteMany(ids)
  })
}
