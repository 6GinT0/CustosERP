import { describe, it, expect, vi, beforeEach } from 'vitest'
import { companyService } from '../CompanyService'
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

describe('CompanyService', () => {
  let mockDb: { select: any; execute: any }

  beforeEach(async () => {
    vi.clearAllMocks()
    mockDb = await (Database.load as any)('sqlite:app.db')
  })

  it('should get all companies and map from snake_case', async () => {
    const dbItems = [
      {
        id: 1,
        cuit: '30-12345678-9',
        social_reason: 'TEST COMPANY',
        social_number: '123',
        fantasy_name: 'TEST FANTASY',
        address: 'TEST ADDRESS 123',
        latitude: -34.6,
        longitude: -58.4,
        phone: '1122334455',
        contact_name: 'TEST CONTACT',
        total_visits_count: 0,
        total_inspections_count: 0,
      },
    ]
    mockDb.select.mockResolvedValue(dbItems)

    const result = await companyService.getAll()

    expect(result).toEqual([
      {
        id: 1,
        cuit: '30-12345678-9',
        socialReason: 'TEST COMPANY',
        socialNumber: '123',
        fantasyName: 'TEST FANTASY',
        address: 'TEST ADDRESS 123',
        latitude: -34.6,
        longitude: -58.4,
        phone: '1122334455',
        contactName: 'TEST CONTACT',
        totalVisitsCount: 0,
        totalInspectionsCount: 0,
      },
    ])
    expect(mockDb.select).toHaveBeenCalledWith('SELECT * FROM companies')
  })

  it('should create a company', async () => {
    const newCompany = {
      cuit: '30-87654321-9',
      social_reason: 'new company',
      fantasy_name: 'new fantasy',
      address: 'new address 456',
      contact_name: 'new contact',
      total_visits_count: 0,
      total_inspections_count: 0,
    }
    mockDb.execute.mockResolvedValue({ lastInsertId: 2 })

    const result = await companyService.create(newCompany as any)

    expect(result.id).toBe(2)
    expect(mockDb.execute).toHaveBeenCalledWith(
      'INSERT INTO companies (cuit, social_reason, social_number, fantasy_name, address, latitude, longitude, phone, contact_name, total_visits_count, total_inspections_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [
        '30-87654321-9',
        'NEW COMPANY',
        null,
        'NEW FANTASY',
        'NEW ADDRESS 456',
        null,
        null,
        null,
        'NEW CONTACT',
        0,
        0,
      ],
    )
  })
})
