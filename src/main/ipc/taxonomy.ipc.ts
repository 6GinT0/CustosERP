import { ipcMain } from 'electron'
import { taxonomyService } from '../services/taxonomy.service'

export function registerTaxonomyHandlers(): void {
  ipcMain.handle('taxonomy:getAll', async () => {
    return taxonomyService.getAll()
  })

  ipcMain.handle('taxonomy:getByType', async (_event, type) => {
    return taxonomyService.getByType(type)
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
