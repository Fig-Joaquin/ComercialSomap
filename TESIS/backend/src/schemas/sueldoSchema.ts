import { z } from 'zod';
import { TipoSueldo } from '../entities/sueldoEntity';
import { TipoTransaccion } from '../entities/transaccionEntity';

const fechaSchema = z.string().refine((val) => {
  const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (!regex.test(val)) return false;
  const [day, month, year] = val.split('-').map(Number);
  const date = new Date(`${year}-${month}-${day}`);
  return !isNaN(date.getTime()) && date.getDate() === day && date.getMonth() + 1 === month && date.getFullYear() === year;
}, {
  message: 'Fecha inválida. Debe ser una fecha válida en formato dd-mm-yyyy.'
}).describe("Fecha de la transacción en formato dd-mm-yyyy.");

const tipoTransaccionSchema = z.nativeEnum(TipoTransaccion).describe("Tipo de transacción, puede ser 'Ingreso' o 'Egreso'.");
const montoSchema = z.number().positive().describe("Monto de la transacción. Debe ser un número positivo.");

const tipoSueldoSchema = z.nativeEnum(TipoSueldo).describe("Tipo de sueldo, puede ser 'semanal', 'mensual' o 'quincena'.");
const descripcionSchema = z.string().max(255, "La descripción no puede exceder 255 caracteres").nullable().describe("Descripción opcional del sueldo. Puede contener hasta 255 caracteres.");

export const sueldoSchemaRegistro = z.object({
  fecha: fechaSchema,
  tipo: tipoTransaccionSchema,
  monto: montoSchema,
  descripcion_transaccion: descripcionSchema,
  tipo_sueldo: tipoSueldoSchema,
  descripcion: descripcionSchema,
}).describe("Esquema de validación para el registro de un nuevo sueldo. Todos los campos son obligatorios excepto la descripción, que es opcional.");

export const sueldoSchemaActualizacion = sueldoSchemaRegistro.partial().describe("Esquema de validación para la actualización parcial de un sueldo. Todos los campos son opcionales.");
