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
    mockDb.select.mockResolvedValue([])
    mockDb.execute.mockResolvedValue({ lastInsertId: 1 })

    const result = await categoryService.create(newCategory)

    expect(result).toEqual({ id: 1, name: 'TEST', description: 'DESC' })
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO categories'),
      expect.arrayContaining(['TEST', 'DESC']),
    )
  })

  it('should update a category and convert name to uppercase', async () => {
    const category = { id: 1, name: 'updated', description: 'new desc' }
    mockDb.execute.mockResolvedValue({})

    const result = await categoryService.update(category)

    expect(result).toEqual({ id: 1, name: 'UPDATED', description: 'NEW DESC' })
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE categories'),
      expect.arrayContaining(['UPDATED', 'NEW DESC', 1]),
    )
  })

  it('should delete a category', async () => {
    mockDb.execute.mockResolvedValue({})

    await categoryService.delete(1)

    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM categories'),
      expect.arrayContaining([1]),
    )
  })

  it('should delete many categories', async () => {
    mockDb.execute.mockResolvedValue({})

    await categoryService.deleteMany([1, 2, 3])

    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM categories'),
      expect.arrayContaining([1, 2, 3]),
    )
  })
})
