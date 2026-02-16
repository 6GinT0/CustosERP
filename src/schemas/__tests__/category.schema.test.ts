import { describe, it, expect } from 'vitest'
import { categorySchema } from '../category.schema'

describe('categorySchema', () => {
  it('should validate a valid category', () => {
    const validCategory = {
      name: 'Test Category',
      description: 'Test Description',
    }
    const result = categorySchema.safeParse(validCategory)
    expect(result.success).toBe(true)
  })

  it('should validate a valid category without description', () => {
    const validCategory = {
      name: 'Test Category',
    }
    const result = categorySchema.safeParse(validCategory)
    expect(result.success).toBe(true)
  })

  it('should validate a valid category with null description', () => {
    const validCategory = {
      name: 'Test Category',
      description: null,
    }
    const result = categorySchema.safeParse(validCategory)
    expect(result.success).toBe(true)
  })

  it('should fail if name is empty', () => {
    const invalidCategory = {
      name: '',
    }
    const result = categorySchema.safeParse(invalidCategory)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre es obligatorio')
    }
  })

  it('should fail if name is too long', () => {
    const invalidCategory = {
      name: 'a'.repeat(101),
    }
    const result = categorySchema.safeParse(invalidCategory)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre es demasiado largo')
    }
  })

  it('should fail if description is too long', () => {
    const invalidCategory = {
      name: 'Test',
      description: 'a'.repeat(501),
    }
    const result = categorySchema.safeParse(invalidCategory)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('La descripción es demasiado larga')
    }
  })
})
