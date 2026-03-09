import { ipcMain } from 'electron'
import { inspectionService, type DashboardFilters } from '../services/inspection.service'

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

  ipcMain.handle('inspection:getMostFrequentReason', async (_, filters?: DashboardFilters) => {
    return await inspectionService.getMostFrequentReason(filters)
  })

  ipcMain.handle(
    'inspection:getTotalInspectionsAndVisits',
    async (_, filters?: DashboardFilters) => {
      return await inspectionService.getTotalInspectionsAndVisits(filters)
    }
  )

  ipcMain.handle('inspection:getCompliancePercentage', async (_, filters?: DashboardFilters) => {
    return await inspectionService.getCompliancePercentage(filters)
  })

  ipcMain.handle(
    'inspection:getInspectionsPerDay',
    async (
      _,
      {
        startDate,
        endDate,
        filters
      }: { startDate: Date; endDate: Date; filters?: DashboardFilters }
    ) => {
      return await inspectionService.getInspectionsPerDay(
        new Date(startDate),
        new Date(endDate),
        filters
      )
    }
  )

  ipcMain.handle('inspection:getDistribution', async (_, filters?: DashboardFilters) => {
    return await inspectionService.getDistribution(filters)
  })

  ipcMain.handle('inspection:getCompliancePerItem', async (_, filters?: DashboardFilters) => {
    return await inspectionService.getCompliancePerItem(filters)
  })

  ipcMain.handle('inspection:getRecentInspections', async (_, filters?: DashboardFilters) => {
    return await inspectionService.getRecentInspections(filters)
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
