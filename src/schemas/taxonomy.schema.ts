import { z } from 'zod'

export const taxonomySchema = z.object({
  type: z.enum(['AREA', 'SECTOR', 'REASON'], 'El tipo es obligatorio'),
  name: z
    .string('El campo debe ser una cadena de texto')
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre es demasiado largo'),
})

export type TaxonomySchema = z.infer<typeof taxonomySchema>
