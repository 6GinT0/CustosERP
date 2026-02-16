import { describe, it, expect } from 'vitest'
import { taxonomySchema } from '../taxonomy.schema'

describe('taxonomySchema', () => {
  it('should validate a valid taxonomy AREA', () => {
    const validTaxonomy = {
      type: 'AREA',
      name: 'Test Area',
    }
    const result = taxonomySchema.safeParse(validTaxonomy)
    expect(result.success).toBe(true)
  })

  it('should validate a valid taxonomy SECTOR', () => {
    const validTaxonomy = {
      type: 'SECTOR',
      name: 'Test Sector',
    }
    const result = taxonomySchema.safeParse(validTaxonomy)
    expect(result.success).toBe(true)
  })

  it('should validate a valid taxonomy REASON', () => {
    const validTaxonomy = {
      type: 'REASON',
      name: 'Test Reason',
    }
    const result = taxonomySchema.safeParse(validTaxonomy)
    expect(result.success).toBe(true)
  })

  it('should fail if type is invalid', () => {
    const invalidTaxonomy = {
      type: 'INVALID',
      name: 'Test',
    }
    // @ts-expect-error testing invalid enum
    const result = taxonomySchema.safeParse(invalidTaxonomy)
    expect(result.success).toBe(false)
  })

  it('should fail if name is empty', () => {
    const invalidTaxonomy = {
      type: 'AREA',
      name: '',
    }
    const result = taxonomySchema.safeParse(invalidTaxonomy)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre es obligatorio')
    }
  })
})
