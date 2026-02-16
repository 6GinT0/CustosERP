import { describe, it, expect, vi, beforeEach } from 'vitest'
import { categoryItemService } from '../CategoryItemService'
import Database from '@tauri-apps/plugin-sql'

vi.mock('@tauri-apps/plugin-sql', () => {
  const select = vi.fn()
  const execute = vi.fn()
  return {
    default: {
      load: vi.fn().mockResolvedValue({
        select,
        execute,
      }),
    },
  }
})

describe('CategoryItemService', () => {
  let mockDb: { select: any; execute: any }

  beforeEach(async () => {
    vi.clearAllMocks()
    mockDb = await (Database.load as any)('sqlite:app.db')
  })

  it('should get all items and map from snake_case', async () => {
    const dbItems = [{ id: 1, category_id: 10, name: 'Item 1', law_reference: 'Art 1' }]
    mockDb.select.mockResolvedValue(dbItems)

    const result = await categoryItemService.getAll()

    expect(result).toEqual([{ id: 1, categoryId: 10, name: 'Item 1', lawReference: 'Art 1' }])
  })

  it('should get items by categoryId', async () => {
    mockDb.select.mockResolvedValue([])

    await categoryItemService.getByCategoryId(10)

    expect(mockDb.select).toHaveBeenCalledWith(
      'SELECT * FROM category_items WHERE category_id = $1',
      [10],
    )
  })

  it('should create an item and convert name/lawReference to uppercase', async () => {
    const newItem = { categoryId: 10, name: 'test item', lawReference: 'art 1' }
    mockDb.execute.mockResolvedValue({ lastInsertId: 1 })

    const result = await categoryItemService.create(newItem)

    expect(result).toEqual({
      id: 1,
      categoryId: 10,
      name: 'TEST ITEM',
      lawReference: 'ART 1',
    })
    expect(mockDb.execute).toHaveBeenCalledWith(
      'INSERT INTO category_items (category_id, name, law_reference) VALUES ($1, $2, $3)',
      [10, 'TEST ITEM', 'ART 1'],
    )
  })

  it('should delete an item', async () => {
    mockDb.execute.mockResolvedValue({})

    await categoryItemService.delete(1)

    expect(mockDb.execute).toHaveBeenCalledWith('DELETE FROM category_items WHERE id = $1', [1])
  })
})
