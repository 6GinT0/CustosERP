import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useInspectionDataTable } from '../useInspectionDataTable'

const mockInspection = {
  handleDelete: vi.fn(),
  handleDeleteMany: vi.fn(),
}

const mockDialog = {
  isDialogOpen: ref(false),
  openDialog: vi.fn(),
  closeDialog: vi.fn(),
}

// Mock dependencies
vi.mock('../useInspectionForm', () => ({
  useInspectionForm: () => mockInspection,
}))

vi.mock('../useDatabase', () => ({
  useDatabase: () => ({
    inspections: ref([]),
  }),
}))

vi.mock('../useDialog', () => ({
  useDialog: () => mockDialog,
}))

describe('useInspectionDataTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDialog.isDialogOpen.value = false
  })

  it('should initialize with default states', () => {
    const { search, selected, inspectionData } = useInspectionDataTable()

    expect(search.value).toBe('')
    expect(selected.value).toEqual([])
    expect(inspectionData.value).toBeNull()
  })

  it('should open dialog for a single item', async () => {
    const { openAction, inspectionData, selected } = useInspectionDataTable()
    const item = { id: 1, date: '2024-03-01' }

    selected.value = [1, 2] as any
    await openAction(item)

    expect(selected.value).toEqual([])
    expect(inspectionData.value.id).toBe(1)
    expect(inspectionData.value.name).toContain('Inspección #1')
    expect(mockDialog.openDialog).toHaveBeenCalled()
  })

  it('should handle cancel action', async () => {
    const { cancelAction, selected, inspectionData } = useInspectionDataTable()

    selected.value = [1] as any
    inspectionData.value = { id: 1 }
    await cancelAction()

    expect(selected.value).toEqual([])
    expect(inspectionData.value).toBeNull()
    expect(mockDialog.closeDialog).toHaveBeenCalled()
  })

  it('should handle delete action', async () => {
    const { deleteAction, inspectionData } = useInspectionDataTable()
    inspectionData.value = { id: 5 }

    await deleteAction()

    expect(mockInspection.handleDelete).toHaveBeenCalledWith(5)
    expect(inspectionData.value).toBeNull()
    expect(mockDialog.closeDialog).toHaveBeenCalled()
  })

  it('should handle deleteMany action', async () => {
    const { deleteManyAction, selected } = useInspectionDataTable()
    selected.value = [10, 11] as any

    await deleteManyAction()

    expect(mockInspection.handleDeleteMany).toHaveBeenCalledWith([10, 11])
    expect(selected.value).toEqual([])
    expect(mockDialog.closeDialog).toHaveBeenCalled()
  })
})
