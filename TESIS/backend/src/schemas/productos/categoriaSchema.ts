import { z } from 'zod';

export const categoriaSchema = z.object({
  tipo: z.string()
    .min(1, 'La categoria es obligatoria')
    .max(50, 'La categoria debe tener menos de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'La categoria solo puede contener letras y espacios'),
});

export type CategoriaSchema = z.infer<typeof categoriaSchema>;
