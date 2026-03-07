import { z } from 'zod'

const cuitRegex = /^\d{2}-\d{8}-\d{1}$/

export const companySchema = z.object({
  cuit: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .regex(cuitRegex, 'Formato de CUIT inválido (XX-XXXXXXXX-X)'),
  social_reason: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .min(1, 'Mínimo 1 carácter')
    .nullable(),
  social_number: z
    .number({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser de tipo numérico'
    })
    .positive('El campo debe ser un número positivo')
    .optional()
    .nullable(),
  fantasy_name: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .min(1, 'Mínimo 1 carácter'),
  address: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .min(1, 'Mínimo 1 carácter'),
  latitude: z.number({
    required_error: 'El campo es obligatorio',
    invalid_type_error: 'El campo debe ser un número'
  }),
  longitude: z.number({
    required_error: 'El campo es obligatorio',
    invalid_type_error: 'El campo debe ser un número'
  }),
  phone: z
    .string({
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .optional()
    .nullable(),
  contact_name: z
    .string({
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .optional()
    .nullable()
})

export type Company = z.infer<typeof companySchema>
