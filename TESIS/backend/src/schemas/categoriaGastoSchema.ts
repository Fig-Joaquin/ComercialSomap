import { z } from 'zod';

export const categoriaGastoSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(45, 'El nombre no puede exceder 45 caracteres')
    .refine((val) => /^[a-zA-Z\s]+$/.test(val), {
      message: 'El nombre no puede contener números'
    })
    .transform((val) => val.toLowerCase()),
});

export type CategoriaGastoSchema = z.infer<typeof categoriaGastoSchema>;
