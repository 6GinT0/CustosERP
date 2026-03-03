import { describe, it, expect } from 'vitest'
import {
  inspectionSchema,
  observationsSchema,
  inspectionResultSchema,
  inspectionFormSchema,
  InspectionStatus,
} from '../inspections.schema'

describe('Inspections Schema', () => {
  describe('inspectionSchema', () => {
    it('should validate a correct inspection', () => {
      const data = {
        date: new Date(),
        company_id: 1,
        professional_id: 2,
        area_id: 3,
        sector_id: 4,
        reason_id: 5,
        art: 'ART-123',
        work_schedule: 'Mon de 09 a 18',
        current_employee_count: 10,
      }
      const result = inspectionSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should fail if missing required fields', () => {
      const data = {
        date: new Date(),
      }
      const result = inspectionSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should fail if employee count is negative', () => {
      const data = {
        date: new Date(),
        company_id: 1,
        professional_id: 2,
        area_id: 3,
        sector_id: 4,
        reason_id: 5,
        art: 'ART-123',
        work_schedule: 'Mon de 09 a 18',
        current_employee_count: -5,
      }
      const result = inspectionSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('observationsSchema', () => {
    it('should allow empty observations', () => {
      const data = {
        observations: null,
        breach: '',
      }
      const result = observationsSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('inspectionResultSchema', () => {
    it('should validate an array of results', () => {
      const data = {
        results: [
          { category_item_id: 1, status: InspectionStatus.OK },
          { category_item_id: 2, status: InspectionStatus['No OK'] },
        ],
      }
      const result = inspectionResultSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('inspectionFormSchema', () => {
    it('should validate the complete form structure', () => {
      const data = {
        inspection: {
          date: new Date(),
          company_id: 1,
          professional_id: 2,
          area_id: 3,
          sector_id: 4,
          reason_id: 5,
          art: 'X',
          work_schedule: 'X',
          current_employee_count: 1,
        },
        observations: { observations: 'X', breach: 'X' },
        results: {
          results: [{ category_item_id: 1, status: 1 }],
        },
      }
      const result = inspectionFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})
