import { describe, it, expect } from 'vitest'
import { professionalSchema } from '../professional.schema'

describe('Professional Schema', () => {
  it('should validate a correct professional', () => {
    const data = {
      fullname: 'Juan Perez',
      tuition_number: '12345',
    }
    const result = professionalSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should fail if fullname is too short', () => {
    const data = {
      fullname: '',
      tuition_number: '12345',
    }
    const result = professionalSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('should allow nullable signature_file', () => {
    const data = {
      fullname: 'Juan Perez',
      tuition_number: '12345',
      signature_file: null,
    }
    const result = professionalSchema.safeParse(data)
    expect(result.success).toBe(true)
  })
})
