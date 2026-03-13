import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { ipcRenderer } from 'electron'
import type { DashboardFilters } from '../main/services/inspection.service'

// Custom APIs for renderer
const api = {
  taxonomy: {
    getAll: () => ipcRenderer.invoke('taxonomy:getAll'),
    getByType: (type: string) => ipcRenderer.invoke('taxonomy:getByType', type),
    search: (query: string) => ipcRenderer.invoke('taxonomy:search', query),
    create: (data: { name: string; type: string }) => ipcRenderer.invoke('taxonomy:create', data),
    update: (data: { id: number; name: string; type: string }) =>
      ipcRenderer.invoke('taxonomy:update', data),
    delete: (id: number) => ipcRenderer.invoke('taxonomy:delete', id),
    deleteMany: (ids: number[]) => ipcRenderer.invoke('taxonomy:deleteMany', ids)
  },
  category: {
    getAll: () => ipcRenderer.invoke('category:getAll'),
    search: (query: string) => ipcRenderer.invoke('category:search', query),
    create: (data: { name: string; description?: string }) =>
      ipcRenderer.invoke('category:create', data),
    update: (data: { id: number; name: string; description?: string }) =>
      ipcRenderer.invoke('category:update', data),
    delete: (id: number) => ipcRenderer.invoke('category:delete', id),
    deleteMany: (ids: number[]) => ipcRenderer.invoke('category:deleteMany', ids)
  },
  categoryItem: {
    getAll: () => ipcRenderer.invoke('categoryItem:getAll'),
    getByCategoryId: (categoryId: number) =>
      ipcRenderer.invoke('categoryItem:getByCategoryId', categoryId),
    search: (query: string, categoryId?: number) =>
      ipcRenderer.invoke('categoryItem:search', { query, categoryId }),
    create: (data: { name: string; category_id: number; law_reference?: string }) =>
      ipcRenderer.invoke('categoryItem:create', data),
    update: (data: { id: number; name: string; category_id: number; law_reference?: string }) =>
      ipcRenderer.invoke('categoryItem:update', data),
    delete: (id: number) => ipcRenderer.invoke('categoryItem:delete', id),
    deleteMany: (ids: number[]) => ipcRenderer.invoke('categoryItem:deleteMany', ids)
  },
  company: {
    getAll: () => ipcRenderer.invoke('company:getAll'),
    getById: (id: number) => ipcRenderer.invoke('company:getById', id),
    search: (query: string) => ipcRenderer.invoke('company:search', query),
    create: (data: any) => ipcRenderer.invoke('company:create', data),
    update: (id: number, data: any) => ipcRenderer.invoke('company:update', { id, data }),
    delete: (id: number) => ipcRenderer.invoke('company:delete', id),
    deleteMany: (ids: number[]) => ipcRenderer.invoke('company:deleteMany', ids)
  },
  professional: {
    getAll: () => ipcRenderer.invoke('professional:getAll'),
    getById: (id: number) => ipcRenderer.invoke('professional:getById', id),
    search: (query: string) => ipcRenderer.invoke('professional:search', query),
    create: (data: any) => ipcRenderer.invoke('professional:create', data),
    update: (id: number, data: any) => ipcRenderer.invoke('professional:update', { id, data }),
    delete: (id: number) => ipcRenderer.invoke('professional:delete', id),
    deleteMany: (ids: number[]) => ipcRenderer.invoke('professional:deleteMany', ids)
  },
  inspection: {
    getAll: () => ipcRenderer.invoke('inspection:getAll'),
    getById: (id: number) => ipcRenderer.invoke('inspection:getById', id),
    getByCompany: (companyId: number) => ipcRenderer.invoke('inspection:getByCompany', companyId),
    getMostFrequentReason: (filters?: DashboardFilters) =>
      ipcRenderer.invoke('inspection:getMostFrequentReason', filters),
    getTotalInspectionsAndVisits: (filters?: DashboardFilters) =>
      ipcRenderer.invoke('inspection:getTotalInspectionsAndVisits', filters),
    getCompliancePercentage: (filters?: DashboardFilters) =>
      ipcRenderer.invoke('inspection:getCompliancePercentage', filters),
    getInspectionsPerDay: (startDate: Date, endDate: Date, filters?: DashboardFilters) =>
      ipcRenderer.invoke('inspection:getInspectionsPerDay', { startDate, endDate, filters }),
    getDistribution: (filters?: DashboardFilters) =>
      ipcRenderer.invoke('inspection:getDistribution', filters),
    getCompliancePerItem: (filters?: DashboardFilters) =>
      ipcRenderer.invoke('inspection:getCompliancePerItem', filters),
    getRecentInspections: (filters?: DashboardFilters) =>
      ipcRenderer.invoke('inspection:getRecentInspections', filters),
    create: (data: any) => ipcRenderer.invoke('inspection:create', data),
    update: (id: number, data: any) => ipcRenderer.invoke('inspection:update', { id, data }),
    delete: (id: number) => ipcRenderer.invoke('inspection:delete', id),
    deleteMany: (ids: number[]) => ipcRenderer.invoke('inspection:deleteMany', ids)
  },
  inspectionResult: {
    getAll: () => ipcRenderer.invoke('inspectionResult:getAll'),
    getByInspectionId: (inspectionId: number) =>
      ipcRenderer.invoke('inspectionResult:getByInspectionId', inspectionId),
    create: (data: any) => ipcRenderer.invoke('inspectionResult:create', data),
    update: (id: number, data: any) => ipcRenderer.invoke('inspectionResult:update', { id, data }),
    delete: (id: number) => ipcRenderer.invoke('inspectionResult:delete', id)
  },
  pdf: {
    save: (fileName: string, pdfData: number[]) =>
      ipcRenderer.invoke('pdf:save', { fileName, pdfData }),
    generate: (inspectionId: number) => ipcRenderer.invoke('pdf:generate', { inspectionId })
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
