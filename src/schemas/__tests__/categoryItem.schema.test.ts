import { describe, it, expect } from 'vitest'
import { categoryItemSchema } from '../categoryItem.schema'

describe('categoryItemSchema', () => {
  it('should validate a valid category item', () => {
    const validItem = {
      categoryId: 1,
      name: 'Test Item',
      lawReference: 'Art. 123',
    }
    const result = categoryItemSchema.safeParse(validItem)
    expect(result.success).toBe(true)
  })

  it('should validate without law reference', () => {
    const validItem = {
      categoryId: 1,
      name: 'Test Item',
    }
    const result = categoryItemSchema.safeParse(validItem)
    expect(result.success).toBe(true)
  })

  it('should fail if categoryId is not a number', () => {
    const invalidItem = {
      categoryId: '1',
      name: 'Test Item',
    }
    // @ts-expect-error testing invalid data types
    const result = categoryItemSchema.safeParse(invalidItem)
    expect(result.success).toBe(false)
  })

  it('should fail if categoryId is not positive', () => {
    const invalidItem = {
      categoryId: 0,
      name: 'Test Item',
    }
    const result = categoryItemSchema.safeParse(invalidItem)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('La categoría es obligatoria')
    }
  })

  it('should fail if name is empty', () => {
    const invalidItem = {
      categoryId: 1,
      name: '',
    }
    const result = categoryItemSchema.safeParse(invalidItem)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre es obligatorio')
    }
  })

  it('should fail if lawReference is too long', () => {
    const invalidItem = {
      categoryId: 1,
      name: 'Test',
      lawReference: 'a'.repeat(201),
    }
    const result = categoryItemSchema.safeParse(invalidItem)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('La referencia legal es demasiado larga')
    }
  })
})
