import { z } from 'zod';

export const proveedorSchema = z.object({
  nombre_empresa: z.string()
    .min(1, 'El nombre de la empresa es obligatorio')
    .max(100, 'El nombre de la empresa debe tener menos de 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre de la empresa solo puede contener letras y espacios'),
  telefono: z.string()
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(15, 'El teléfono debe tener menos de 15 dígitos')
    .regex(/^[0-9]+$/, 'El teléfono solo puede contener números'), //Se maneja Telefono como String en la bd
  razon_social: z.string()
    .min(1, 'La razón social es obligatoria')
    .max(100, 'La razón social debe tener menos de 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'La razon social solo puede contener letras y espacios'),
  direccion: z.string()
    .min(1, 'La dirección es obligatoria')
    .max(255, 'La dirección debe tener menos de 255 caracteres')
    .regex(/^[a-zA-Z0-9\s#]+$/, { message: 'La dirección solo puede contener letras, números, espacios y el carácter #' }),
});

export type ProveedorSchema = z.infer<typeof proveedorSchema>;
