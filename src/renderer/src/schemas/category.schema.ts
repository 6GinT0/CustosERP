import { z } from 'zod'

export const categorySchema = z.object({
  name: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre es demasiado largo'),
  description: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .max(500, 'La descripción es demasiado larga')
    .optional()
    .nullable()
})

export type CategorySchema = z.infer<typeof categorySchema>
