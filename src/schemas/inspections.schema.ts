import { z } from 'zod'

export enum InspectionStatus {
  'N/A' = 0,
  'No OK' = 1,
  OK = 2,
}

export const inspectionResultSchema = z.object({
  results: z.array(
    z.object({
      category_item_id: z
        .number('El campo debe ser un número')
        .int('El campo debe ser un número entero')
        .positive('El campo debe ser un número positivo'),
      status: z.enum(InspectionStatus),
    }),
  ),
})

export type InspectionResult = z.infer<typeof inspectionResultSchema>

export const observationsSchema = z.object({
  observations: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'El campo es obligatorio'
          : 'El campo debe ser una cadena de texto',
    })
    .max(500, 'Máximo 500 caracteres')
    .optional()
    .nullable(),
  breach: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'El campo es obligatorio'
          : 'El campo debe ser una cadena de texto',
    })
    .max(500, 'Máximo 500 caracteres')
    .optional()
    .nullable(),
})

export type Observation = z.infer<typeof observationsSchema>

export const inspectionSchema = z.object({
  date: z.date({
    error: (issue) =>
      issue.input === undefined ? 'El campo es obligatorio' : 'El campo debe ser una fecha',
  }),
  company_id: z
    .number('El campo debe ser un número')
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
  professional_id: z
    .number('El campo debe ser un número')
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
  area_id: z
    .number('Campo obligatorio')
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
  sector_id: z
    .number('Campo obligatorio')
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
  reason_id: z
    .number('Campo obligatorio')
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
  art: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'El campo es obligatorio'
          : 'El campo debe ser una cadena de texto',
    })
    .min(1, 'Mínimo 1 carácter'),
  work_schedule: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'El campo es obligatorio'
          : 'El campo debe ser una cadena de texto',
    })
    .min(1, 'Mínimo 1 carácter'),
  current_employee_count: z
    .number('El campo debe ser un número')
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
  signature_customer_file: z
    .file()
    .min(10_000)
    .max(1_000_000)
    .refine((file) => file.type.startsWith('image/'), { error: 'Solo imágenes' })
    .optional()
    .nullable(),
})

export type Inspection = z.infer<typeof inspectionSchema>

export const inspectionFormSchema = z.object({
  inspection: inspectionSchema,
  observations: observationsSchema,
  results: inspectionResultSchema,
})
