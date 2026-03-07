import { z } from 'zod'

export const taxonomySchema = z.object({
  type: z.enum(['AREA', 'SECTOR', 'REASON'], {
    required_error: 'El tipo es obligatorio',
    invalid_type_error: 'El tipo debe ser una cadena de texto'
  }),
  name: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre es demasiado largo')
})

export type TaxonomySchema = z.infer<typeof taxonomySchema>
