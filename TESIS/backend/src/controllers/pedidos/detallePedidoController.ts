import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { DetallePedido } from '../../entities/pedidos/detallePedidoEntity'; // Nombre de la clase actualizado
import { detallePedidoSchema } from '../../schemas/pedidos/detallePedidoSchema';
import { ZodValidatorAdapter } from '../../plugins/zod-validator-plugin';
import logger from '../../utils/logger';

// Instancia del adaptador de validación
const validator = new ZodValidatorAdapter(detallePedidoSchema);

// ---------------- Crear un detalle de pedido ----------------
export const createDetallePedido = async (req: Request, res: Response) => {
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createDetallePedido: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for detalle de pedido', errors: validationResult.errors });
  }

  const {
    id_pedido,
    id_producto,
    cantidad,
    precio_total,
    descuento,
  } = req.body;

  try {
    const detallePedidoRepository = AppDataSource.getRepository(DetallePedido);
    const newDetallePedido = detallePedidoRepository.create({
      id_pedido,
      id_producto,
      cantidad,
      precio_total,
      descuento,
    });
    await detallePedidoRepository.save(newDetallePedido);
    logger.info('Detalle de pedido created: %o', newDetallePedido);
    res.status(201).json(newDetallePedido);
  } catch (err) {
    logger.error('Error creating detalle de pedido: %o', err);
    res.status(500).json({ message: 'Error creating detalle de pedido' });
  }
};

// ---------------- Obtener todos los detalles de pedidos ----------------
export const getAllDetallePedidos = async (req: Request, res: Response) => {
  try {
    const detallePedidoRepository = AppDataSource.getRepository(DetallePedido);
    const detalles = await detallePedidoRepository.find();
    res.status(200).json(detalles);
  } catch (err) {
    logger.error('Error fetching detalles de pedidos: %o', err);
    res.status(500).json({ message: 'Error fetching detalles de pedidos' });
  }
};

// ---------------- Obtener un detalle de pedido por ID ----------------
export const getDetallePedidoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const detallePedidoRepository = AppDataSource.getRepository(DetallePedido);
    const detalle = await detallePedidoRepository.findOne({ where: { id_detalle: Number(id) } });

    if (!detalle) {
      logger.warn('Detalle de pedido not found for id_detalle: %s', id);
      return res.status(404).json({ message: 'Detalle de pedido not found' });
    }

    res.status(200).json(detalle);
  } catch (err) {
    logger.error('Error fetching detalle de pedido by ID: %o', err);
    res.status(500).json({ message: 'Error fetching detalle de pedido by ID' });
  }
};

// ---------------- Actualizar un detalle de pedido ----------------
export const updateDetallePedido = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for updateDetallePedido: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for detalle de pedido', errors: validationResult.errors });
  }

  const {
    id_pedido,
    id_producto,
    cantidad,
    precio_total,
    descuento,
  } = req.body;

  try {
    const detallePedidoRepository = AppDataSource.getRepository(DetallePedido);

    // Verificar si el detalle de pedido existe
    const detalle = await detallePedidoRepository.findOne({ where: { id_detalle: Number(id) } });
    if (!detalle) {
      logger.warn('Detalle de pedido not found for id_detalle: %s', id);
      return res.status(404).json({ message: 'Detalle de pedido not found' });
    }

    // Actualizar el detalle de pedido
    detalle.id_pedido = id_pedido;
    detalle.id_producto = id_producto;
    detalle.cantidad = cantidad;
    detalle.precio_total = precio_total;
    detalle.descuento = descuento;

    await detallePedidoRepository.save(detalle);
    logger.info('Detalle de pedido updated: %o', detalle);
    res.status(200).json(detalle);
  } catch (err) {
    logger.error('Error updating detalle de pedido: %o', err);
    res.status(500).json({ message: 'Error updating detalle de pedido' });
  }
};

// ---------------- Eliminar un detalle de pedido ----------------
export const deleteDetallePedido = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const detallePedidoRepository = AppDataSource.getRepository(DetallePedido);

    // Verificar si el detalle de pedido existe
    const detalle = await detallePedidoRepository.findOne({ where: { id_detalle: Number(id) } });
    if (!detalle) {
      logger.warn('Detalle de pedido not found for id_detalle: %s', id);
      return res.status(404).json({ message: 'Detalle de pedido not found' });
    }

    await detallePedidoRepository.remove(detalle);
    logger.info('Detalle de pedido deleted: %o', detalle);
    res.status(200).json({ message: 'Detalle de pedido deleted successfully' });
  } catch (err) {
    logger.error('Error deleting detalle de pedido: %o', err);
    res.status(500).json({ message: 'Error deleting detalle de pedido' });
  }
};
