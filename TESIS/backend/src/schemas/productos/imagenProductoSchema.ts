import { z } from 'zod';

// Esquema de validación para ImagenProducto
export const imagenProductoSchema = z.object({
  id_producto: z.number()
    .int('ID_Producto debe ser un número entero')
    .positive('ID_Producto debe ser un número positivo'),
  url: z.string()
    .min(1, 'La URL no puede estar vacía')
    .regex(/^\/uploads\/imagenes\/[\w\-]+\.(jpg|jpeg|png)$/, 'La URL debe tener un formato válido para la ruta del archivo')
  });

export type ImagenProductoSchema = z.infer<typeof imagenProductoSchema>;
