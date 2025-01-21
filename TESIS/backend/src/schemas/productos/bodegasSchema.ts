import { z } from 'zod';

export const bodegaSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre debe tener menos de 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  dirección: z.string()
    .min(1, 'La dirección es obligatoria')
    .max(255, 'La dirección debe tener menos de 255 caracteres')
    .regex(/^[a-zA-Z0-9\s#]+$/, { message: 'La dirección solo puede contener letras, números, espacios y el carácter #' }),
});

export type BodegaSchema = z.infer<typeof bodegaSchema>;
