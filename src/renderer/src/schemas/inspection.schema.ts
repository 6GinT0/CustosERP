import { z } from 'zod'

export const inspectionResultSchema = z.object({
  results: z.array(
    z.object({
      category_item_id: z
        .number({
          required_error: 'El campo ees obligatorio',
          invalid_type_error: 'El campo debe der un número'
        })
        .int('El campo debe ser un número entero')
        .positive('El campo debe ser un número positivo'),
      status: z.enum(['N/A', 'No OK', 'OK'])
    })
  )
})

export type InspectionResult = z.infer<typeof inspectionResultSchema>

export const observationsSchema = z.object({
  observations: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .max(500, 'Máximo 500 caracteres')
    .optional()
    .nullable(),
  breach: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .max(500, 'Máximo 500 caracteres')
    .optional()
    .nullable()
})

export type Observation = z.infer<typeof observationsSchema>

export const inspectionSchema = z.object({
  date: z.date({
    required_error: 'El campo es obligatorio',
    invalid_type_error: 'El campo debe ser una fecha'
  }),
  company_id: z
    .number({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser un número'
    })
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
  professional_id: z
    .number({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser un número'
    })
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
  area_id: z
    .number({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser un número'
    })
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
  sector_id: z
    .number({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser un número'
    })
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
  reason_id: z
    .number({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser un número'
    })
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
  art: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .min(1, 'Mínimo 1 carácter'),
  work_schedule: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .min(1, 'Mínimo 1 carácter')
    .nullable(),
  current_employee_count: z
    .number({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser un número'
    })
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo')
    .nullable(),
  total_inspections_count: z
    .number({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser un número'
    })
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
  total_visits_count: z
    .number({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser un número'
    })
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
  signature_customer_file: z.any().optional().nullable()
})

export type Inspection = z.infer<typeof inspectionSchema>

export const inspectionFormSchema = z.object({
  inspection: inspectionSchema,
  observations: observationsSchema,
  results: inspectionResultSchema
})
