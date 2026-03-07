import { ipcMain } from 'electron'
import { companyService } from '../services/company.service'

export function registerCompanyHandlers(): void {
  ipcMain.handle('company:getAll', async () => {
    return companyService.getAll()
  })

  ipcMain.handle('company:getById', async (_event, id) => {
    return companyService.getById(id)
  })

  ipcMain.handle('company:create', async (_event, data) => {
    return companyService.create(data)
  })

  ipcMain.handle('company:search', async (_event, query) => {
    return companyService.search(query)
  })

  ipcMain.handle('company:update', async (_event, { id, data }) => {
    return companyService.update(id, data)
  })

  ipcMain.handle('company:delete', async (_event, id) => {
    return companyService.delete(id)
  })

  ipcMain.handle('company:deleteMany', async (_event, ids) => {
    return companyService.deleteMany(ids)
  })
}
