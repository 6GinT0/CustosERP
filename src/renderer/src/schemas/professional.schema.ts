import { z } from 'zod'

export const professionalSchema = z.object({
  fullname: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .min(1, 'El nombre es obligatorio'),
  tuition_number: z
    .string({
      required_error: 'El campo es obligatorio',
      invalid_type_error: 'El campo debe ser una cadena de texto'
    })
    .min(1, 'La matrícula es obligatoria'),
  signature_file: z.any().optional().nullable()
})

export type ProfessionalSchema = z.infer<typeof professionalSchema>
