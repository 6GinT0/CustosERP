import { ipcMain } from 'electron'
import { inspectionService } from '../services/inspection.service'

export function registerInspectionHandlers(): void {
  ipcMain.handle('inspection:getAll', async () => {
    return await inspectionService.getAll()
  })

  ipcMain.handle('inspection:getById', async (_, id: number) => {
    return await inspectionService.getById(id)
  })

  ipcMain.handle('inspection:getByCompany', async (_, companyId: number) => {
    return await inspectionService.getByCompany(companyId)
  })

  ipcMain.handle('inspection:create', async (_, data: any) => {
    return await inspectionService.create(data)
  })

  ipcMain.handle('inspection:update', async (_, { id, data }: { id: number; data: any }) => {
    return await inspectionService.update(id, data)
  })

  ipcMain.handle('inspection:delete', async (_, id: number) => {
    return await inspectionService.delete(id)
  })

  ipcMain.handle('inspection:deleteMany', async (_, ids: number[]) => {
    return await inspectionService.deleteMany(ids)
  })
}
