import { ipcMain } from 'electron'
import { professionalService } from '../services/professional.service'

export function registerProfessionalHandlers(): void {
  ipcMain.handle('professional:getAll', async () => {
    return professionalService.getAll()
  })

  ipcMain.handle('professional:getById', async (_event, id) => {
    return professionalService.getById(id)
  })

  ipcMain.handle('professional:create', async (_event, data) => {
    return professionalService.create(data)
  })

  ipcMain.handle('professional:search', async (_event, query) => {
    return professionalService.search(query)
  })

  ipcMain.handle('professional:update', async (_event, { id, data }) => {
    return professionalService.update(id, data)
  })

  ipcMain.handle('professional:delete', async (_event, id) => {
    return professionalService.delete(id)
  })

  ipcMain.handle('professional:deleteMany', async (_event, ids) => {
    return professionalService.deleteMany(ids)
  })
}
