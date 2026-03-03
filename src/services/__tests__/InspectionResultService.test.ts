import { describe, it, expect, vi, beforeEach } from 'vitest'
import { inspectionResultService } from '../InspectionResultService'
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

describe('InspectionResultService', () => {
  let mockDb: { select: any; execute: any }

  beforeEach(async () => {
    vi.clearAllMocks()
    mockDb = await (Database.load as any)('sqlite:app.db')
  })

  it('should get results by inspection id', async () => {
    const dbItems = [
      {
        id: 1,
        inspection_id: 10,
        category_item_id: 100,
        status: 1,
        item_snapshot: JSON.stringify({ name: 'Test Item', law_reference: 'Art 1' }),
      },
    ]
    mockDb.select.mockResolvedValue(dbItems)

    const result = await inspectionResultService.getByInspectionId(10)

    expect(result).toEqual([
      {
        id: 1,
        inspectionId: 10,
        categoryItemId: 100,
        status: 1,
        itemSnapshot: JSON.stringify({ name: 'Test Item', law_reference: 'Art 1' }),
      },
    ])
  })

  it('should create an inspection result with snapshot object', async () => {
    const newResult = {
      inspectionId: 10,
      categoryItemId: 100,
      status: 2 as const,
      itemSnapshot: { name: 'Snapshot', law_reference: 'Ref' },
    }

    mockDb.execute.mockResolvedValue({ lastInsertId: 1 })

    const result = await inspectionResultService.create(newResult)

    expect(result.id).toBe(1)
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO inspection_results'),
      expect.arrayContaining([
        10,
        100,
        2,
        JSON.stringify({ name: 'Snapshot', law_reference: 'Ref' }),
      ]),
    )
  })

  it('createManyWithSnapshots should fetch items and insert with snapshots', async () => {
    // 1. Mock select for category_items
    mockDb.select.mockResolvedValue([
      { id: 1, name: 'Item 1', law_reference: 'Ref 1' },
      { id: 2, name: 'Item 2', law_reference: 'Ref 2' },
    ])

    const results = [
      { category_item_id: 1, status: 1 },
      { category_item_id: 2, status: 0 },
    ]

    mockDb.execute.mockResolvedValue({ lastInsertId: 1 })

    await inspectionResultService.createManyWithSnapshots(10, results)

    // Should have called select once for items
    expect(mockDb.select).toHaveBeenCalledWith(
      expect.stringContaining('SELECT id, name, law_reference FROM category_items'),
    )

    // Should have called execute twice for inserts
    expect(mockDb.execute).toHaveBeenCalledTimes(2)

    // Check first insert
    expect(mockDb.execute).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('INSERT INTO inspection_results'),
      [10, 1, 1, JSON.stringify({ name: 'Item 1', law_reference: 'Ref 1' })],
    )

    // Check second insert
    expect(mockDb.execute).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('INSERT INTO inspection_results'),
      [10, 2, 0, JSON.stringify({ name: 'Item 2', law_reference: 'Ref 2' })],
    )
  })
})
