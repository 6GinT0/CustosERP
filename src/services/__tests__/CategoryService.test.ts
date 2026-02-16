import { describe, it, expect, vi, beforeEach } from 'vitest'
import { categoryService } from '../CategoryService'
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

describe('CategoryService', () => {
  let mockDb: { select: any; execute: any }

  beforeEach(async () => {
    vi.clearAllMocks()
    mockDb = await (Database.load as any)('sqlite:app.db')
  })

  it('should get all categories', async () => {
    const categories = [{ id: 1, name: 'TEST', description: 'Desc' }]
    mockDb.select.mockResolvedValue(categories)

    const result = await categoryService.getAll()

    expect(result).toEqual(categories)
    expect(mockDb.select).toHaveBeenCalledWith('SELECT * FROM categories')
  })

  it('should create a category and convert name to uppercase', async () => {
    const newCategory = { name: 'test', description: 'desc' }
    mockDb.execute.mockResolvedValue({ lastInsertId: 1 })

    const result = await categoryService.create(newCategory)

    expect(result).toEqual({ id: 1, name: 'TEST', description: 'desc' })
    expect(mockDb.execute).toHaveBeenCalledWith(
      'INSERT INTO categories (name, description) VALUES ($1, $2)',
      ['TEST', 'desc'],
    )
  })

  it('should update a category and convert name to uppercase', async () => {
    const category = { id: 1, name: 'updated', description: 'new desc' }
    mockDb.execute.mockResolvedValue({})

    const result = await categoryService.update(category)

    expect(result).toEqual({ id: 1, name: 'UPDATED', description: 'new desc' })
    expect(mockDb.execute).toHaveBeenCalledWith(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3',
      ['UPDATED', 'new desc', 1],
    )
  })

  it('should delete a category', async () => {
    mockDb.execute.mockResolvedValue({})

    await categoryService.delete(1)

    expect(mockDb.execute).toHaveBeenCalledWith('DELETE FROM categories WHERE id = $1', [1])
  })

  it('should delete many categories', async () => {
    mockDb.execute.mockResolvedValue({})

    await categoryService.deleteMany([1, 2, 3])

    expect(mockDb.execute).toHaveBeenCalledWith(
      'DELETE FROM categories WHERE id IN ($1, $2, $3)',
      [1, 2, 3],
    )
  })
})
