import { ipcMain } from 'electron'
import { inspectionResultService } from '../services/inspection-result.service'

export function registerInspectionResultHandlers(): void {
  ipcMain.handle('inspectionResult:getAll', async () => {
    return await inspectionResultService.getAll()
  })

  ipcMain.handle('inspectionResult:getByInspectionId', async (_, inspectionId: number) => {
    return await inspectionResultService.getByInspectionId(inspectionId)
  })

  ipcMain.handle('inspectionResult:create', async (_, data: any) => {
    return await inspectionResultService.create(data)
  })

  ipcMain.handle('inspectionResult:update', async (_, { id, data }: { id: number; data: any }) => {
    return await inspectionResultService.update(id, data)
  })

  ipcMain.handle('inspectionResult:delete', async (_, id: number) => {
    return await inspectionResultService.delete(id)
  })
}
