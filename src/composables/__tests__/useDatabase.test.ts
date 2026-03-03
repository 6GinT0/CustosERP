import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useDatabase } from '../useDatabase'
import { taxonomyService } from '@/services/TaxonomyService'
import { categoryService } from '@/services/CategoryService'
import { categoryItemService } from '@/services/CategoryItemService'
import { companyService } from '@/services/CompanyService'
import { professionalService } from '@/services/ProfessionalService'
import { inspectionService } from '@/services/InspectionService'

vi.mock('@/services/TaxonomyService', () => ({
  taxonomyService: {
    getAll: vi.fn(),
  },
}))

vi.mock('@/services/CategoryService', () => ({
  categoryService: {
    getAll: vi.fn(),
  },
}))

vi.mock('@/services/CategoryItemService', () => ({
  categoryItemService: {
    getAll: vi.fn(),
  },
}))

vi.mock('@/services/CompanyService', () => ({
  companyService: {
    getAll: vi.fn(),
  },
}))

vi.mock('@/services/ProfessionalService', () => ({
  professionalService: {
    getAll: vi.fn(),
  },
}))

vi.mock('@/services/InspectionService', () => ({
  inspectionService: {
    getAll: vi.fn(),
  },
}))

describe('useDatabase', () => {
  const db = useDatabase()

  beforeEach(() => {
    vi.clearAllMocks()
    db.taxonomies.value = []
    db.categories.value = []
    db.categoryItems.value = []
    db.companies.value = []
    db.professionals.value = []
    db.inspections.value = []
    db.isLoading.value = false
  })

  it('should load initial data', async () => {
    const mockTax = [{ id: 1, name: 'Tax 1', type: 'AREA' }]
    const mockCat = [{ id: 1, name: 'Cat 1', description: '' }]
    const mockItems = [{ id: 1, categoryId: 1, name: 'Item 1' }]
    const mockCompanies = [{ id: 1, fantasyName: 'Company 1' }]
    const mockProfessionals = [{ id: 1, fullName: 'Professional 1' }]
    const mockInspections = [{ id: 1, companyId: 1 }]

    vi.mocked(taxonomyService.getAll).mockResolvedValue(mockTax as any)
    vi.mocked(categoryService.getAll).mockResolvedValue(mockCat as any)
    vi.mocked(categoryItemService.getAll).mockResolvedValue(mockItems as any)
    vi.mocked(companyService.getAll).mockResolvedValue(mockCompanies as any)
    vi.mocked(professionalService.getAll).mockResolvedValue(mockProfessionals as any)
    vi.mocked(inspectionService.getAll).mockResolvedValue(mockInspections as any)

    await db.loadInitialData()

    expect(db.taxonomies.value).toEqual(mockTax)
    expect(db.categories.value).toEqual(mockCat)
    expect(db.categoryItems.value).toEqual(mockItems)
    expect(db.companies.value).toEqual(mockCompanies)
    expect(db.professionals.value).toEqual(mockProfessionals)
    expect(db.inspections.value).toEqual(mockInspections)
    expect(db.isLoading.value).toBe(false)
  })

  it('should add an item to a list', () => {
    const list = ref<{ id: number; name: string }[]>([])
    db.addItem(list, { id: 1, name: 'Test' })
    expect(list.value).toHaveLength(1)
    expect(list.value[0].name).toBe('Test')
  })

  it('should update an item in a list', () => {
    const list = ref([
      { id: 1, name: 'Old' },
      { id: 2, name: 'Other' },
    ])
    db.updateItem(list, { id: 1, name: 'New' })
    expect(list.value[0].name).toBe('New')
    expect(list.value[1].name).toBe('Other')
  })

  it('should remove an item from a list', () => {
    const list = ref([
      { id: 1, name: '1' },
      { id: 2, name: '2' },
    ])
    db.removeItem(list, 1)
    expect(list.value).toHaveLength(1)
    expect(list.value[0].id).toBe(2)
  })

  it('should remove multiple items from a list', () => {
    const list = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
    db.removeItems(list, [1, 3])
    expect(list.value).toHaveLength(1)
    expect(list.value[0].id).toBe(2)
  })
})
