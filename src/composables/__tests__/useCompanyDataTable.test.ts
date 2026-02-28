import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useCompanyDataTable } from '../useCompanyDataTable'
import { useCompany } from '../useCompany'
import { useDialog } from '../useDialog'

const mockCompany = {
  handleDelete: vi.fn(),
  handleDeleteMany: vi.fn(),
}

const mockDialog = {
  isDialogOpen: ref(false),
  openDialog: vi.fn(),
  closeDialog: vi.fn(),
}

// Mock dependencies
vi.mock('../useCompany', () => ({
  useCompany: () => mockCompany,
}))

vi.mock('../useDatabase', () => ({
  useDatabase: () => ({
    companies: ref([]),
  }),
}))

vi.mock('../useDialog', () => ({
  useDialog: () => mockDialog,
}))

describe('useCompanyDataTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDialog.isDialogOpen.value = false
  })

  it('should initialize with default states', () => {
    const { search, selected, companyData } = useCompanyDataTable()

    expect(search.value).toBe('')
    expect(selected.value).toEqual([])
    expect(companyData.value).toBeNull()
  })

  it('should open dialog for a single item', async () => {
    const { openAction, companyData, selected } = useCompanyDataTable()
    const item = { id: 1, fantasyName: 'Test' }

    selected.value = [1, 2]
    await openAction(item)

    expect(selected.value).toEqual([])
    expect(companyData.value).toEqual({ ...item, name: 'Test' })
    expect(mockDialog.openDialog).toHaveBeenCalled()
  })

  it('should open dialog for multiple items', async () => {
    const { openManyAction, companyData } = useCompanyDataTable()

    await openManyAction()

    expect(companyData.value).toBeNull()
    expect(mockDialog.openDialog).toHaveBeenCalled()
  })

  it('should handle cancel action', async () => {
    const { cancelAction, selected, companyData } = useCompanyDataTable()

    selected.value = [1] as any
    companyData.value = { id: 1 }
    await cancelAction()

    expect(selected.value).toEqual([])
    expect(companyData.value).toBeNull()
    expect(mockDialog.closeDialog).toHaveBeenCalled()
  })

  it('should handle delete action', async () => {
    const { deleteAction, companyData } = useCompanyDataTable()
    companyData.value = { id: 1 }

    await deleteAction()

    expect(mockCompany.handleDelete).toHaveBeenCalledWith(1)
    expect(companyData.value).toBeNull()
    expect(mockDialog.closeDialog).toHaveBeenCalled()
  })

  it('should handle deleteMany action', async () => {
    const { deleteManyAction, selected } = useCompanyDataTable()
    selected.value = [1, 2] as any

    await deleteManyAction()

    expect(mockCompany.handleDeleteMany).toHaveBeenCalledWith([1, 2])
    expect(selected.value).toEqual([])
    expect(mockDialog.closeDialog).toHaveBeenCalled()
  })
})
