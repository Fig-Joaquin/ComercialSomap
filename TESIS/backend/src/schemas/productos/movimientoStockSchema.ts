import { z } from 'zod';

export const movimientoStockSchema = z.object({
  id_producto: z.number().min(1, 'El ID del producto es obligatorio y debe ser mayor a 0'),
  fecha_movimiento: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'La fecha de movimiento debe ser válida',
  }),
  cantidad: z.number().positive('La cantidad debe ser mayor a 0'),
  tipo_movimiento: z.enum(['INGRESO', 'EGRESO'], {
    errorMap: () => ({ message: 'El tipo de movimiento debe ser INGRESO o EGRESO' }),
  }),
  descripcion: z.string().optional(),
  usuario_responsable: z.string().optional(),
});
