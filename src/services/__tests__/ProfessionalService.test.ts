import { describe, it, expect, vi, beforeEach } from 'vitest'
import { professionalService } from '../ProfessionalService'
import Database from '@tauri-apps/plugin-sql'
import { invoke } from '@tauri-apps/api/core'

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

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}))

describe('ProfessionalService', () => {
  let mockDb: { select: any; execute: any }

  beforeEach(async () => {
    vi.clearAllMocks()
    mockDb = await (Database.load as any)('sqlite:app.db')
  })

  it('should search professionals', async () => {
    const dbItems = [
      {
        id: 1,
        fullname: 'John Doe',
        tuition_number: '12345',
        signature_path: '/path/to/sig.png',
      },
    ]
    mockDb.select.mockResolvedValue(dbItems)

    const result = await professionalService.search('John')

    expect(result[0].fullName).toBe('John Doe')
    expect(mockDb.select).toHaveBeenCalledWith(expect.stringContaining('JOIN professionals_fts'), [
      'John',
    ])
  })

  it('should get all professionals and map data', async () => {
    const dbItems = [
      {
        id: 1,
        fullname: 'John Doe',
        tuition_number: '12345',
        signature_path: '/path/to/sig.png',
      },
    ]
    mockDb.select.mockResolvedValue(dbItems)

    const result = await professionalService.getAll()

    expect(result).toEqual([
      {
        id: 1,
        fullName: 'John Doe',
        tuitionNumber: '12345',
        signaturePath: '/path/to/sig.png',
      },
    ])
    expect(mockDb.select).toHaveBeenCalledWith('SELECT * FROM professionals')
  })

  it('should get a professional by id', async () => {
    const dbItem = {
      id: 1,
      fullname: 'John Doe',
      tuition_number: '12345',
      signature_path: '/path/to/sig.png',
    }
    mockDb.select.mockResolvedValue([dbItem])

    const result = await professionalService.getById(1)

    expect(result.fullName).toBe('John Doe')
    expect(mockDb.select).toHaveBeenCalledWith(expect.stringContaining('WHERE id = $1'), [1])
  })

  it('should create a professional without signature', async () => {
    const newProf = {
      fullname: 'Jane Doe',
      tuition_number: '67890',
    }
    mockDb.execute.mockResolvedValue({ lastInsertId: 2 })

    const result = await professionalService.create(newProf as any)

    expect(result.id).toBe(2)
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO professionals ('),
      ['Jane Doe', '67890', null],
    )
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO professionals_fts'),
      [2, 'Jane Doe', '67890'],
    )
  })

  it('should create a professional with signature', async () => {
    const mockFile = new File([''], 'sig.png', { type: 'image/png' })
    const newProf = {
      fullname: 'Jane Doe',
      tuition_number: '67890',
      signature_file: mockFile,
    }

    mockFile.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(8))

    const savedPath = '/appdata/signatures/123_sig.png'
    vi.mocked(invoke).mockResolvedValue(savedPath)
    mockDb.execute.mockResolvedValue({ lastInsertId: 3 })

    const result = await professionalService.create(newProf as any)

    expect(result.signaturePath).toBe(savedPath)
    expect(invoke).toHaveBeenCalledWith(
      'save_file',
      expect.objectContaining({
        name: expect.stringContaining('sig.png'),
        data: expect.any(Array),
      }),
    )
  })

  it('should update a professional', async () => {
    const updateData = {
      fullname: 'Updated Name',
      tuition_number: '55555',
    }
    const dbItem = { id: 1, fullname: 'Updated Name', tuition_number: '55555' }

    mockDb.execute.mockResolvedValue({ lastInsertId: 1 })
    mockDb.select.mockResolvedValue([dbItem])

    const result = await professionalService.update(1, updateData as any)

    expect(result.fullName).toBe('Updated Name')
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE professionals SET'),
      ['Updated Name', '55555', 1],
    )
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT OR REPLACE INTO professionals_fts'),
      [1, 'Updated Name', '55555'],
    )
  })

  it('should delete a professional', async () => {
    await professionalService.delete(1)
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM professionals WHERE id = $1'),
      [1],
    )
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM professionals_fts WHERE rowid = $1'),
      [1],
    )
  })

  it('should delete many professionals', async () => {
    await professionalService.deleteMany([1, 2, 3])
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM professionals WHERE id IN'),
      [1, 2, 3],
    )
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM professionals_fts WHERE rowid IN'),
      [1, 2, 3],
    )
  })
})
