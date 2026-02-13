import { z } from 'zod'

export const categoryItemSchema = z.object({
  categoryId: z.number('El campo debe ser un número').positive('La categoría es obligatoria'),
  name: z
    .string('El campo debe ser una cadena de texto')
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre es demasiado largo'),
  lawReference: z
    .string('El campo debe ser una cadena de texto')
    .max(200, 'La referencia legal es demasiado larga')
    .optional()
    .nullable(),
})

export type CategoryItemSchema = z.infer<typeof categoryItemSchema>
