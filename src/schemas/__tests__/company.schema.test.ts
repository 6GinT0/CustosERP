import { describe, it, expect } from 'vitest'
import { companySchema } from '../company.schema'

describe('companySchema', () => {
  const validCompany = {
    cuit: '20-12345678-9',
    social_reason: 'Empresa S.A.',
    social_number: 12345,
    fantasy_name: 'Mi Empresa',
    address: 'Calle Falsa 123',
    latitude: -34.7167,
    longitude: -58.3833,
    phone: '11-2233-4455',
    contact_name: 'Juan Perez',
    total_visits_count: 5,
    total_inspections_count: 2,
  }

  it('should validate a valid company object', () => {
    const result = companySchema.safeParse(validCompany)
    expect(result.success).toBe(true)
  })

  it('should validate with optional fields as null', () => {
    const company = {
      ...validCompany,
      social_number: null,
      phone: null,
      contact_name: null,
    }
    const result = companySchema.safeParse(company)
    expect(result.success).toBe(true)
  })

  it('should fail if CUIT format is invalid', () => {
    const company = { ...validCompany, cuit: '20-123456789' } // missing last dash
    const result = companySchema.safeParse(company)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Formato de CUIT inválido (XX-XXXXXXXX-X)')
    }
  })

  it('should fail if required fields are missing', () => {
    const { cuit, ...invalidCompany } = validCompany
    // @ts-expect-error testing missing field
    const result = companySchema.safeParse(invalidCompany)
    expect(result.success).toBe(false)
  })

  it('should fail if strings are empty', () => {
    const company = { ...validCompany, social_reason: '' }
    const result = companySchema.safeParse(company)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Mínimo 1 carácter')
    }
  })

  it('should fail if coordinates are not numbers', () => {
    const company = { ...validCompany, latitude: 'not-a-number' }
    // @ts-expect-error testing invalid type
    const result = companySchema.safeParse(company)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El campo debe ser un número')
    }
  })

  it('should fail if total_visits_count is not positive', () => {
    const company = { ...validCompany, total_visits_count: 0 }
    const result = companySchema.safeParse(company)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El campo debe ser un número positivo')
    }
  })

  it('should fail if total_inspections_count is not an integer', () => {
    const company = { ...validCompany, total_inspections_count: 1.5 }
    const result = companySchema.safeParse(company)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El campo debe ser un número entero')
    }
  })
})
