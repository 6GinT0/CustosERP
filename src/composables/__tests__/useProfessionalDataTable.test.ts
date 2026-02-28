import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useProfessionalDataTable } from '../useProfessionalDataTable'
import { useProfessional } from '../useProfessional'
import { useDialog } from '../useDialog'

const mockProfessional = {
  handleDelete: vi.fn(),
  handleDeleteMany: vi.fn(),
}

const mockDialog = {
  isDialogOpen: ref(false),
  openDialog: vi.fn(),
  closeDialog: vi.fn(),
}

// Mock dependencies
vi.mock('../useProfessional', () => ({
  useProfessional: () => mockProfessional,
}))

vi.mock('../useDatabase', () => ({
  useDatabase: () => ({
    professionals: ref([]),
  }),
}))

vi.mock('../useDialog', () => ({
  useDialog: () => mockDialog,
}))

describe('useProfessionalDataTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDialog.isDialogOpen.value = false
  })

  it('should initialize with default states', () => {
    const { search, selected, professionalData } = useProfessionalDataTable()

    expect(search.value).toBe('')
    expect(selected.value).toEqual([])
    expect(professionalData.value).toBeNull()
  })

  it('should open dialog for a single item', async () => {
    const { openAction, professionalData, selected } = useProfessionalDataTable()
    const item = { id: 1, fullName: 'John Doe' }

    selected.value = [1, 2] as any
    await openAction(item)

    expect(selected.value).toEqual([])
    expect(professionalData.value).toEqual({ ...item, name: 'John Doe' })
    expect(mockDialog.openDialog).toHaveBeenCalled()
  })

  it('should open dialog for multiple items', async () => {
    const { openManyAction, professionalData } = useProfessionalDataTable()

    await openManyAction()

    expect(professionalData.value).toBeNull()
    expect(mockDialog.openDialog).toHaveBeenCalled()
  })

  it('should handle cancel action', async () => {
    const { cancelAction, selected, professionalData } = useProfessionalDataTable()

    selected.value = [1] as any
    professionalData.value = { id: 1 }
    await cancelAction()

    expect(selected.value).toEqual([])
    expect(professionalData.value).toBeNull()
    expect(mockDialog.closeDialog).toHaveBeenCalled()
  })

  it('should handle delete action', async () => {
    const { deleteAction, professionalData } = useProfessionalDataTable()
    professionalData.value = { id: 5 }

    await deleteAction()

    expect(mockProfessional.handleDelete).toHaveBeenCalledWith(5)
    expect(professionalData.value).toBeNull()
    expect(mockDialog.closeDialog).toHaveBeenCalled()
  })

  it('should handle deleteMany action', async () => {
    const { deleteManyAction, selected } = useProfessionalDataTable()
    selected.value = [10, 11] as any

    await deleteManyAction()

    expect(mockProfessional.handleDeleteMany).toHaveBeenCalledWith([10, 11])
    expect(selected.value).toEqual([])
    expect(mockDialog.closeDialog).toHaveBeenCalled()
  })
})
