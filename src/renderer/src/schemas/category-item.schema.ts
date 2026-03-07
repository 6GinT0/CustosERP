import { z } from 'zod'

export const categoryItemSchema = z.object({
  category_id: z
    .number({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser un número'
    })
    .positive('La categoría es obligatoria'),
  name: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre es demasiado largo'),
  law_reference: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .max(200, 'La referencia legal es demasiado larga')
    .optional()
    .nullable()
})

export type CategoryItemSchema = z.infer<typeof categoryItemSchema>
