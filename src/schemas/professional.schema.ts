import { z } from 'zod'

export const professionalSchema = z.object({
  fullname: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'El campo es obligatorio'
          : 'El campo debe ser una cadena de texto',
    })
    .min(1, 'Mínimo 1 carácter'),
  tuition_number: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'El campo es obligatorio'
          : 'El campo debe ser una cadena de texto',
    })
    .min(1, 'Mínimo 1 carácter'),
  signature_file: z
    .file()
    .min(10_000)
    .max(1_000_000)
    .refine((file) => file.type.startsWith('image/'), { error: 'Solo imágenes' })
    .optional()
    .nullable(),
})

export type Professional = z.infer<typeof professionalSchema>
