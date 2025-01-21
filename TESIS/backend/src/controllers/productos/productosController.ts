import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Productos } from '../../entities/productos/productosEntity';
import { UnidadMedida } from '../../entities/productos/unidadMedidaEntity';
import { productoSchema } from '../../schemas/productos/productosSchema';
import { ZodValidatorAdapter } from '../../plugins/zod-async-plugin';
import logger from '../../utils/logger';

// Instancia del adaptador de validación
const validator = new ZodValidatorAdapter(productoSchema);

// ---------------- Crear un producto ----------------
export const createProducto = async (req: Request, res: Response) => {
  const validationResult = await validator.validateAndSanitizeAsync(req.body); // Cambiado a async
  if (!validationResult.success) {
    logger.error('Invalid input for createProducto: %o', validationResult.errors);
    return res.status(400).json({ message: 'Datos inválidos', errors: validationResult.errors });
  }

  const {
    id_proveedor,
    id_categoria,
    id_bodega,
    nombre,
    descripcion,
    precio_neto,
    precio_venta,
    id_unidad_medida, // ID de unidad de medida
    stock_unidades,
    unidades_por_caja,
    sku,
  } = validationResult.data;

  try {
    const productoRepository = AppDataSource.getRepository(Productos);
    const unidadMedidaRepository = AppDataSource.getRepository(UnidadMedida);

    // Verificar si la unidad de medida existe
    const unidadMedida = await unidadMedidaRepository.findOne({ where: { id_unidad: id_unidad_medida } });
    if (!unidadMedida) {
      return res.status(404).json({ message: 'Unidad de medida no encontrada.' });
    }

    const newProducto = productoRepository.create({
      id_proveedor,
      id_categoria,
      id_bodega,
      nombre,
      descripcion,
      precio_neto,
      precio_venta,
      unidad_medida: unidadMedida, // Relación con la unidad de medida
      stock_unidades,
      unidades_por_caja,
      sku,
    });
    await productoRepository.save(newProducto);
    logger.info('Producto creado: %o', newProducto);
    res.status(201).json({
      message: 'Producto creado correctamente',
      producto: newProducto,
    });
  } catch (err) {
    logger.error('Error creando producto: %o', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ---------------- Obtener todos los productos ----------------
export const getAllProductos = async (req: Request, res: Response) => {
  try {
    const productoRepository = AppDataSource.getRepository(Productos);
    const productos = await productoRepository.find({ relations: ['unidad_medida'] }); // Incluir la relación
    res.status(200).json(productos);
  } catch (err) {
    logger.error('Error obteniendo productos: %o', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ---------------- Obtener un producto por ID ----------------
export const getProductoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const productoRepository = AppDataSource.getRepository(Productos);
    const producto = await productoRepository.findOne({
      where: { id_producto: Number(id) },
      relations: ['unidad_medida'], // Incluir la relación
    });

    if (!producto) {
      logger.warn('Producto no encontrado para id_producto: %s', id);
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    res.status(200).json(producto);
  } catch (err) {
    logger.error('Error obteniendo producto por ID: %o', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ---------------- Actualizar un producto ----------------
export const updateProducto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validationResult = await validator.validateAndSanitizeAsync(req.body); // Cambiado a async
  if (!validationResult.success) {
    logger.error('Invalid input for updateProducto: %o', validationResult.errors);
    return res.status(400).json({ message: 'Datos inválidos', errors: validationResult.errors });
  }

  const {
    id_proveedor,
    id_categoria,
    id_bodega,
    nombre,
    descripcion,
    precio_neto,
    precio_venta,
    id_unidad_medida, // ID de unidad de medida
    stock_unidades,
    unidades_por_caja,
    sku,
  } = validationResult.data;

  try {
    const productoRepository = AppDataSource.getRepository(Productos);
    const unidadMedidaRepository = AppDataSource.getRepository(UnidadMedida);

    // Verificar si el producto existe
    const producto = await productoRepository.findOne({ where: { id_producto: Number(id) } });
    if (!producto) {
      logger.warn('Producto no encontrado para id_producto: %s', id);
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Verificar si la unidad de medida existe
    const unidadMedida = await unidadMedidaRepository.findOne({ where: { id_unidad: id_unidad_medida } });
    if (!unidadMedida) {
      return res.status(404).json({ message: 'Unidad de medida no encontrada.' });
    }

    // Actualizar el producto
    producto.id_proveedor = id_proveedor;
    producto.id_categoria = id_categoria;
    producto.id_bodega = id_bodega;
    producto.nombre = nombre;
    producto.descripcion = descripcion;
    producto.precio_neto = precio_neto;
    producto.precio_venta = precio_venta;
    producto.unidad_medida = unidadMedida; // Relación con la unidad de medida
    producto.stock_unidades = stock_unidades;
    producto.unidades_por_caja = unidades_por_caja;
    producto.sku = sku;

    await productoRepository.save(producto);
    logger.info('Producto actualizado: %o', producto);
    res.status(200).json(producto);
  } catch (err) {
    logger.error('Error actualizando producto: %o', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ---------------- Eliminar un producto ----------------
export const deleteProducto = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const productoRepository = AppDataSource.getRepository(Productos);

    // Verificar si el producto existe
    const producto = await productoRepository.findOne({ where: { id_producto: Number(id) } });
    if (!producto) {
      logger.warn('Producto no encontrado para id_producto: %s', id);
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    await productoRepository.remove(producto);
    logger.info('Producto eliminado: %o', producto);
    res.status(200).json({ message: 'Producto eliminado correctamente.' });
  } catch (err) {
    logger.error('Error eliminando producto: %o', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
