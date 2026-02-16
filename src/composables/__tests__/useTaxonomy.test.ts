import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useTaxonomy } from '../useTaxonomy'

// Mock dependencies
vi.mock('../useDialog', () => ({
  useDialog: () => ({
    isDialogOpen: ref(false),
    openDialog: vi.fn(),
    closeDialog: vi.fn(),
  }),
}))

vi.mock('../useMessages', () => ({
  useMessages: () => ({
    addMessageToQueue: vi.fn(),
  }),
}))

vi.mock('../useDatabase', () => ({
  useDatabase: () => ({
    addItem: vi.fn(),
    updateItem: vi.fn(),
    removeItem: vi.fn(),
    removeItems: vi.fn(),
    isLoading: ref(false),
  }),
}))

describe('useTaxonomy', () => {
  let list: any
  let taxonomy: any

  beforeEach(() => {
    vi.clearAllMocks()
    list = ref([{ id: 1, name: 'Item 1' }])
    taxonomy = useTaxonomy(list)
  })

  it('should initialize with default values', () => {
    expect(taxonomy.selectedItem.value).toBeNull()
    expect(taxonomy.selected.value).toEqual([])
    expect(taxonomy.action.value).toBe('create')
  })

  it('should prepare for creation', () => {
    taxonomy.create()
    expect(taxonomy.action.value).toBe('create')
    expect(taxonomy.selectedItem.value).toBeNull()
  })

  it('should prepare for edit', () => {
    const item = { id: 1, name: 'Test' }
    taxonomy.edit(item)
    expect(taxonomy.action.value).toBe('edit')
    expect(taxonomy.selectedItem.value).toEqual(item)
    // Verify it's a clone
    expect(taxonomy.selectedItem.value).not.toBe(item)
  })

  it('should handle successful create task', async () => {
    const newItem = { id: 2, name: 'New' }
    const task = vi.fn().mockResolvedValue(newItem)

    await taxonomy.handleCreate(task, 'Success msg')

    expect(task).toHaveBeenCalled()
    // Since useDatabase is mocked, we can't check the list directly if we mock the whole composable
    // but we can check if the mocked addItem was called
  })

  it('should cancel the action', () => {
    taxonomy.edit({ id: 1, name: 'Test' })
    taxonomy.cancel()
    expect(taxonomy.selectedItem.value).toBeNull()
  })
})
