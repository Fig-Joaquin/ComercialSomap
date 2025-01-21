import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';

import { Productos } from '../../entities/productos/productosEntity';



import { ZodValidatorAdapter } from '../../plugins/zod-validator-plugin';
import { MovimientosStock } from '../../entities/productos/movimientoStockEntity';
import { movimientoStockSchema } from '../../schemas/productos/movimientoStockSchema';
import logger from '../../utils/logger';

const validator = new ZodValidatorAdapter(movimientoStockSchema);

// Registrar un movimiento
export const createMovimiento = async (req: Request, res: Response) => {
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createMovimiento: %o', validationResult.errors);
    return res.status(400).json({ message: 'Datos inválidos', errors: validationResult.errors });
  }

  const { id_producto, fecha_movimiento, cantidad, tipo_movimiento, descripcion, usuario_responsable } = req.body;

  try {
    const productoRepository = AppDataSource.getRepository(Productos);
    const movimientoRepository = AppDataSource.getRepository(MovimientosStock);

    // Verificar que el producto exista
    const producto = await productoRepository.findOne({ where: { id_producto } });
    if (!producto) {
      logger.warn('Producto no encontrado: %d', id_producto);
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Crear y guardar el movimiento
    const nuevoMovimiento = movimientoRepository.create({
      producto,
      fecha_movimiento: new Date(fecha_movimiento),
      cantidad,
      tipo_movimiento,
      descripcion,
      usuario_responsable,
    });

    await movimientoRepository.save(nuevoMovimiento);

    logger.info('Movimiento registrado: %o', nuevoMovimiento);
    res.status(201).json({ message: 'Movimiento registrado correctamente', movimiento: nuevoMovimiento });
  } catch (err) {
    logger.error('Error registrando movimiento: %o', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Consultar el stock actual de un producto
export const getStockActual = async (req: Request, res: Response) => {
  const { id_producto } = req.params;

  try {
    const movimientoRepository = AppDataSource.getRepository(MovimientosStock);

    const stock = await movimientoRepository
      .createQueryBuilder('ms')
      .select('SUM(CASE WHEN ms.tipo_movimiento = \'INGRESO\' THEN ms.cantidad ELSE -ms.cantidad END)', 'stock_actual')
      .where('ms.id_producto = :id_producto', { id_producto })
      .getRawOne();

    res.status(200).json({ id_producto, stock_actual: stock.stock_actual || 0 });
  } catch (err) {
    logger.error('Error consultando stock: %o', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Listar movimientos de un producto
export const getMovimientosByProducto = async (req: Request, res: Response) => {
  const { id_producto } = req.params;

  try {
    // Convertir id_producto a número
    const productoId = Number(id_producto);

    // Validar que sea un número válido
    if (isNaN(productoId)) {
      logger.warn('ID del producto inválido: %s', id_producto);
      return res.status(400).json({ message: 'ID del producto inválido' });
    }

    const movimientoRepository = AppDataSource.getRepository(MovimientosStock);

    const movimientos = await movimientoRepository.find({
      where: { producto: { id_producto: productoId } },
      order: { fecha_movimiento: 'ASC' },
    });

    res.status(200).json(movimientos);
  } catch (err) {
    logger.error('Error consultando movimientos: %o', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
