import { describe, it, expect, vi, beforeEach } from 'vitest'
import { taxonomyService } from '../TaxonomyService'
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

describe('TaxonomyService', () => {
  let mockDb: { select: any; execute: any }

  beforeEach(async () => {
    vi.clearAllMocks()
    mockDb = await (Database.load as any)('sqlite:app.db')
  })

  it('should get all taxonomies', async () => {
    const taxonomies = [{ id: 1, name: 'AREA 1', type: 'AREA' }]
    mockDb.select.mockResolvedValue(taxonomies)

    const result = await taxonomyService.getAll()

    expect(result).toEqual(taxonomies)
    expect(mockDb.select).toHaveBeenCalledWith('SELECT * FROM taxonomies')
  })

  it('should create a taxonomy and convert name to uppercase', async () => {
    const newTaxonomy = { name: 'new area', type: 'AREA' as const }
    mockDb.select.mockResolvedValue([])
    mockDb.execute.mockResolvedValue({ lastInsertId: 1 })

    const result = await taxonomyService.create(newTaxonomy)

    expect(result).toEqual({ id: 1, name: 'NEW AREA', type: 'AREA' })
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO taxonomies'),
      expect.arrayContaining(['NEW AREA', 'AREA']),
    )
  })

  it('should delete many taxonomies', async () => {
    mockDb.execute.mockResolvedValue({})

    await taxonomyService.deleteMany([1, 2])

    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM taxonomies'),
      expect.arrayContaining([1, 2]),
    )
  })
})
