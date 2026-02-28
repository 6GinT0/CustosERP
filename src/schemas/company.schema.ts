import { z } from 'zod'

const cuitRegex = /^\d{2}-\d{8}-\d{1}$/

export const companySchema = z.object({
  cuit: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'El campo es obligatorio'
          : 'El campo debe ser una cadena de texto',
    })
    .regex(cuitRegex, 'Formato de CUIT inválido (XX-XXXXXXXX-X)'),
  social_reason: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'El campo es obligatorio'
          : 'El campo debe ser una cadena de texto',
    })
    .min(1, 'Mínimo 1 carácter'),
  social_number: z
    .number('El campo debe ser de tipo numérico')
    .positive('El campo debe ser un número positivo')
    .optional()
    .nullable(),
  fantasy_name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'El campo es obligatorio'
          : 'El campo debe ser una cadena de texto',
    })
    .min(1, 'Mínimo 1 carácter'),
  address: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'El campo es obligatorio'
          : 'El campo debe ser una cadena de texto',
    })
    .min(1, 'Mínimo 1 carácter'),
  latitude: z.number('El campo debe ser un número'),
  longitude: z.number('El campo debe ser un número'),
  phone: z
    .string({
      error: (issue) =>
        issue.input === undefined ? undefined : 'El campo debe ser una cadena de texto',
    })
    .optional()
    .nullable(),
  contact_name: z
    .string({
      error: (issue) =>
        issue.input === undefined ? undefined : 'El campo debe ser una cadena de texto',
    })
    .optional()
    .nullable(),
  total_visits_count: z
    .number('El campo debe ser de tipo numérico')
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
  total_inspections_count: z
    .number('El campo debe ser de tipo numérico')
    .int('El campo debe ser un número entero')
    .positive('El campo debe ser un número positivo'),
})

export type Company = z.infer<typeof companySchema>
