import { z } from 'zod';
import { TipoTransaccion } from '../entities/transaccionEntity';

export const transaccionSchema = z.object({
  fecha: z.string().refine((val) => {
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    if (!regex.test(val)) return false;
    const [day, month, year] = val.split('-').map(Number);
    const date = new Date(`${year}-${month}-${day}`);
    return !isNaN(date.getTime()) && date.getDate() === day && date.getMonth() + 1 === month && date.getFullYear() === year;
  }, {
    message: 'Fecha inválida. Debe ser una fecha válida en formato dd-mm-yyyy.'
  }),
  tipo: z.nativeEnum(TipoTransaccion),
  monto: z.number().positive('El monto debe ser positivo').refine((val) => Number.isFinite(val), {
    message: 'El monto debe ser un número finito.'
  }),
  descripcion: z.string()
    .max(255, 'La descripción no puede exceder 255 caracteres')
});

export const gastoSchema = z.object({
  nombre_gasto: z.string()
    .min(1, 'El nombre del gasto es obligatorio')
    .max(100, 'El nombre del gasto debe tener menos de 100 caracteres'),
  id_categoria_gasto: z.number().positive('El ID de la categoría de gasto debe ser positivo')
});

export const gastoConTransaccionSchema = z.object({
  fecha: transaccionSchema.shape.fecha,
  tipo: transaccionSchema.shape.tipo,
  monto: transaccionSchema.shape.monto,
  descripcion: transaccionSchema.shape.descripcion,
  nombre_gasto: gastoSchema.shape.nombre_gasto,
  id_categoria_gasto: gastoSchema.shape.id_categoria_gasto
});

export const gastoSchemaActualizacion = z.object({
  nombre_gasto: gastoSchema.shape.nombre_gasto.optional(),
  id_categoria_gasto: gastoSchema.shape.id_categoria_gasto.optional(),
  fecha: transaccionSchema.shape.fecha.optional(),
  tipo: transaccionSchema.shape.tipo.optional(),
  monto: transaccionSchema.shape.monto.optional(),
  descripcion: transaccionSchema.shape.descripcion.optional()
}).describe("Esquema de validación para la actualización parcial de un gasto.");

export type GastoConTransaccionSchema = z.infer<typeof gastoConTransaccionSchema>;
