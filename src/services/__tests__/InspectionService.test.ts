import { describe, it, expect, vi, beforeEach } from 'vitest'
import { inspectionService } from '../InspectionService'
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

vi.mock('../InspectionResultService', () => {
  return {
    inspectionResultService: {
      createManyWithSnapshots: vi.fn(),
      deleteByInspectionId: vi.fn(),
    },
  }
})

describe('InspectionService', () => {
  let mockDb: { select: any; execute: any }

  beforeEach(async () => {
    vi.clearAllMocks()
    mockDb = await (Database.load as any)('sqlite:app.db')
  })

  it('should get all inspections and map from snake_case', async () => {
    const dbItems = [
      {
        id: 1,
        date: '2024-03-01T12:00:00Z',
        company_id: 10,
        professional_id: 20,
        area_id: 1,
        sector_id: 2,
        reason_id: 3,
        art: 'ART-TEST',
        work_schedule: '09:00 - 18:00',
        current_employee_count: 50,
        observations: 'Some observations',
        breach: 'Some breach',
        signature_customer_path: '/path/to/signature.png',
      },
    ]
    mockDb.select.mockResolvedValue(dbItems)

    const result = await inspectionService.getAll()

    expect(result).toEqual([
      {
        id: 1,
        date: '2024-03-01T12:00:00Z',
        companyId: 10,
        professionalId: 20,
        areaId: 1,
        sectorId: 2,
        reasonId: 3,
        art: 'ART-TEST',
        workSchedule: '09:00 - 18:00',
        currentEmployeeCount: 50,
        observations: 'Some observations',
        breach: 'Some breach',
        signatureCustomerPath: '/path/to/signature.png',
      },
    ])
    expect(mockDb.select).toHaveBeenCalledWith('SELECT * FROM inspections ORDER BY date DESC')
  })

  it('should create an inspection and its results', async () => {
    const newInspectionSave = {
      inspection: {
        date: new Date('2024-03-01T12:00:00Z'),
        company_id: 10,
        professional_id: 20,
        area_id: 1,
        sector_id: 2,
        reason_id: 3,
        art: 'ART-TEST',
        work_schedule: '09:00 - 18:00',
        current_employee_count: 50,
      },
      observations: {
        observations: 'Obs',
        breach: 'Breach',
      },
      results: {
        results: [{ category_item_id: 1, status: 1 }],
      },
    }

    mockDb.execute.mockResolvedValue({ lastInsertId: 5 })
    // Mock getById to return the created item for mapping
    mockDb.select.mockResolvedValue([
      { id: 5, date: '2024-03-01T12:00:00Z', company_id: 10, professional_id: 20 },
    ])

    const result = await inspectionService.create(newInspectionSave as any)

    expect(result.id).toBe(5)
    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO inspections'),
      expect.arrayContaining(['2024-03-01T12:00:00.000Z', 10, 20, 'Obs', 'Breach']),
    )

    expect(inspectionResultService.createManyWithSnapshots).toHaveBeenCalledWith(
      5,
      newInspectionSave.results.results,
    )
  })

  it('should update an inspection and its results', async () => {
    const existing = {
      id: 5,
      date: '2024-03-01T12:00:00Z',
      company_id: 10,
      professional_id: 20,
    }
    mockDb.select.mockResolvedValue([existing])
    mockDb.execute.mockResolvedValue({ lastInsertId: 5 })

    const updateData = {
      inspection: {
        date: new Date('2024-03-01T12:00:00Z'),
        company_id: 10,
        professional_id: 20,
      },
      observations: { observations: 'Updated obs' },
      results: { results: [{ category_item_id: 2, status: 1 }] },
    }

    await inspectionService.update(5, updateData as any)

    expect(mockDb.execute).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE inspections SET'),
      expect.arrayContaining(['Updated obs', 5]),
    )

    expect(inspectionResultService.deleteByInspectionId).toHaveBeenCalledWith(5)
    expect(inspectionResultService.createManyWithSnapshots).toHaveBeenCalledWith(
      5,
      updateData.results.results,
    )
  })
})
