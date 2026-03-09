import { ElectronAPI } from '@electron-toolkit/preload'
import { Taxonomy } from '#/types/taxonomy'
import { Category } from '#/types/Category'
import { CategoryItem } from '#/types/category-item'
import { Company } from '#/types/company'
import { Professional } from '#/types/professional'
import { Inspection } from '#/types/inspection'
import { InspectionResult } from '#/types/inspection-result'

export interface DashboardFilters {
  dateStart?: Date | null
  dateEnd?: Date | null
  areaId?: number | null
  sectorId?: number | null
  reasonId?: number | null
  companyId?: number | null
  professionalId?: number | null
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      taxonomy: {
        getAll: () => Promise<Taxonomy[]>
        getByType: (type: string) => Promise<Taxonomy[]>
        search: (query: string) => Promise<Taxonomy[]>
        create: (data: { name: string; type: string }) => Promise<Taxonomy>
        update: (data: { id: number; name: string; type: string }) => Promise<Taxonomy>
        delete: (id: number) => Promise<void>
        deleteMany: (ids: number[]) => Promise<void>
      }
      category: {
        getAll: () => Promise<Category[]>
        search: (query: string) => Promise<Category[]>
        create: (data: { name: string; description?: string | null }) => Promise<Category>
        update: (data: {
          id: number
          name: string
          description?: string | null
        }) => Promise<Category>
        delete: (id: number) => Promise<void>
        deleteMany: (ids: number[]) => Promise<void>
      }
      categoryItem: {
        getAll: () => Promise<CategoryItem[]>
        getByCategoryId: (categoryId: number) => Promise<CategoryItem[]>
        search: (query: string, categoryId?: number) => Promise<CategoryItem[]>
        create: (data: {
          name: string
          category_id: number
          law_reference?: string | null
        }) => Promise<CategoryItem>
        update: (data: {
          id: number
          name: string
          category_id: number
          law_reference?: string | null
        }) => Promise<CategoryItem>
        delete: (id: number) => Promise<void>
        deleteMany: (ids: number[]) => Promise<void>
      }
      company: {
        getAll: () => Promise<Company[]>
        getById: (id: number) => Promise<Company>
        search: (query: string) => Promise<Company[]>
        create: (data: any) => Promise<Company>
        update: (id: number, data: any) => Promise<Company>
        delete: (id: number) => Promise<void>
        deleteMany: (ids: number[]) => Promise<void>
      }
      professional: {
        getAll: () => Promise<Professional[]>
        getById: (id: number) => Promise<Professional>
        search: (query: string) => Promise<Professional[]>
        create: (data: any) => Promise<Professional>
        update: (id: number, data: any) => Promise<Professional>
        delete: (id: number) => Promise<void>
        delete: (id: number) => Promise<void>
        deleteMany: (ids: number[]) => Promise<void>
      }
      inspection: {
        getAll: () => Promise<Inspection[]>
        getById: (id: number) => Promise<Inspection | null>
        getByCompany: (companyId: number) => Promise<Inspection[]>
        getMostFrequentReason: (
          filters?: DashboardFilters
        ) => Promise<{ id: number; name: string } | null>
        getTotalInspectionsAndVisits: (
          filters?: DashboardFilters
        ) => Promise<{ inspections: number; visits: number }>
        getCompliancePercentage: (filters?: DashboardFilters) => Promise<number>
        getInspectionsPerDay: (
          startDate: Date,
          endDate: Date,
          filters?: DashboardFilters
        ) => Promise<{ date: string; count: number }[]>
        getDistribution: (filters?: DashboardFilters) => Promise<{
          areas: { name: string; count: number }[]
          sectors: { name: string; count: number }[]
          reasons: { name: string; count: number }[]
        }>
        getCompliancePerItem: (
          filters?: DashboardFilters
        ) => Promise<{ name: string; percentage: number; ok: number; noOk: number; na: number }[]>
        getRecentInspections: (filters?: DashboardFilters) => Promise<
          {
            id: number
            date: string
            company: string
            compliance: string
            visitNumber: number | string
            inspectionNumber: number | string
          }[]
        >
        create: (data: any) => Promise<Inspection>
        update: (id: number, data: any) => Promise<Inspection>
        delete: (id: number) => Promise<void>
        deleteMany: (ids: number[]) => Promise<void>
      }
      inspectionResult: {
        getAll: () => Promise<InspectionResult[]>
        getByInspectionId: (inspectionId: number) => Promise<InspectionResult[]>
        create: (data: any) => Promise<InspectionResult>
        update: (id: number, data: any) => Promise<InspectionResult>
        delete: (id: number) => Promise<void>
      }
    }
  }
}
