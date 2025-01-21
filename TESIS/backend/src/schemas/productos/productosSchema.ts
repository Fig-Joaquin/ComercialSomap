import { z } from 'zod';
import { AppDataSource } from '../../config/data-source';
import { Proveedor } from '../../entities/pedidos/proveedorEntity';
import { Categoria } from '../../entities/productos/categoriaEntity';
import { Bodegas } from '../../entities/productos/bodegasEntity';
import { UnidadMedida } from '../../entities/productos/unidadMedidaEntity';

// Esquema para validar los datos de un producto
export const productoSchema = z.object({
  id_proveedor: z.number()
    .int('ID_Proveedor debe ser un número entero')
    .positive('ID_Proveedor debe ser un número positivo')
    .refine(async (id) => {
      const proveedorRepository = AppDataSource.getRepository(Proveedor);
      const exists = await proveedorRepository.findOne({ where: { id_proveedor: id } });
      return !!exists;
    }, { message: 'El proveedor no existe en la base de datos' }),

  id_categoria: z.number()
    .int('ID_Categoria debe ser un número entero')
    .positive('ID_Categoria debe ser un número positivo')
    .refine(async (id) => {
      const categoriaRepository = AppDataSource.getRepository(Categoria);
      const exists = await categoriaRepository.findOne({ where: { id_categoria: id } });
      return !!exists;
    }, { message: 'La categoría no existe en la base de datos' }),

  id_bodega: z.number()
    .int('ID_Bodega debe ser un número entero')
    .positive('ID_Bodega debe ser un número positivo')
    .refine(async (id) => {
      const bodegaRepository = AppDataSource.getRepository(Bodegas);
      const exists = await bodegaRepository.findOne({ where: { id_bodega: id } });
      return !!exists;
    }, { message: 'La bodega no existe en la base de datos' }),

  id_unidad_medida: z.number()
    .int('ID_Unidad_Medida debe ser un número entero')
    .positive('ID_Unidad_Medida debe ser un número positivo')
    .refine(async (id) => {
      const unidadMedidaRepository = AppDataSource.getRepository(UnidadMedida);
      const exists = await unidadMedidaRepository.findOne({ where: { id_unidad: id } });
      return !!exists;
    }, { message: 'La unidad de medida no existe en la base de datos' }),

  nombre: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre debe tener menos de 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),

  descripcion: z.string()
    .min(1, 'La descripción es obligatoria')
    .max(500, 'La descripción debe tener menos de 500 caracteres'),

  precio_neto: z.number()
    .positive('El precio neto debe ser un número positivo')
    .min(0.01, 'El precio neto debe ser mayor a 0.01'),

  precio_venta: z.number()
    .positive('El precio de venta debe ser un número positivo')
    .min(0.01, 'El precio de venta debe ser mayor a 0.01'),

  stock_unidades: z.number()
    .int('El stock de unidades debe ser un número entero')
    .min(0, 'El stock de unidades no puede ser negativo'),

  unidades_por_caja: z.number()
    .int('Las unidades por caja deben ser un número entero')
    .positive('Las unidades por caja deben ser mayores a 0'),

  sku: z.string()
    .min(1, 'El SKU es obligatorio')
    .max(50, 'El SKU debe tener menos de 50 caracteres')
    .regex(/^[a-zA-Z0-9-]+$/, 'El SKU solo puede contener letras, números y guiones'),
});

export type ProductoSchema = z.infer<typeof productoSchema>;
