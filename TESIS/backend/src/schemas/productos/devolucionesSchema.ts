import { z } from 'zod';

export const devolucionesSchema = z.object({
  id_producto: z.number()
    .int('ID_Productos debe ser un número entero')
    .positive('ID_Productos debe ser un número positivo')
    .min(1, 'ID_Productos es obligatorio'), //Falta validacion para verificar que exista Producto
  cantidad_unidades: z.number()
    .int('La cantidad de unidades debe ser un número entero')
    .positive('La cantidad de unidades debe ser un número positivo')
    .min(1, 'La cantidad de unidades es obligatoria'),
  cantidad_cajas: z.number()
    .int('La cantidad de cajas debe ser un número entero')
    .positive('La cantidad de cajas debe ser un número positivo')
    .min(1, 'La cantidad de cajas es obligatoria'),
  fecha_devolucion: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha de devolución debe tener el formato YYYY-MM-DD')
    .min(1, 'La fecha de devolución es obligatoria'), //*validacion para que la fecha sea automatica
  razon: z.string()
    .min(1, 'La razón es obligatoria')
    .max(255, 'La razón debe tener menos de 255 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'La razon solo puede contener letras y espacios'),
});

export type DevolucionSchema = z.infer<typeof devolucionesSchema>;
