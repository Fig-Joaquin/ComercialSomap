import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Pedidos } from '../../entities/pedidos/pedidosEntity';
import { pedidoSchema } from '../../schemas/pedidos/pedidosSchema';
import { ZodValidatorAdapter } from '../../plugins/zod-validator-plugin';
import logger from '../../utils/logger';

// Instancia del adaptador de validación
const validator = new ZodValidatorAdapter(pedidoSchema);

// ---------------- Crear un pedido ----------------
export const createPedido = async (req: Request, res: Response) => {
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createPedido: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for pedido', errors: validationResult.errors });
  }

  const {
    id_cliente,
    id_proveedor,
    tipo_pedido,
    fecha_pedido,
    fecha_entrega,
    comentarios,
    estado,
  } = req.body;

  try {
    const pedidoRepository = AppDataSource.getRepository(Pedidos);
    const newPedido = pedidoRepository.create({
      cliente: { id_cliente }, // Referencia actualizada
      proveedor: { id_proveedor }, // Referencia actualizada
      tipo_pedido,
      fecha_pedido,
      fecha_entrega,
      comentarios,
      estado,
    });
    await pedidoRepository.save(newPedido);
    logger.info('Pedido created: %o', newPedido);
    res.status(201).json({ message: 'Pedido created successfully', newPedido });
  } catch (err) {
    logger.error('Error creating Pedido: %o', err);
    res.status(500).json({ message: 'Error creating pedido' });
  }
};

// ---------------- Obtener todos los pedidos ----------------
export const getAllPedidos = async (req: Request, res: Response) => {
  try {
    const pedidoRepository = AppDataSource.getRepository(Pedidos);
    const pedidos = await pedidoRepository.find();
    res.status(200).json(pedidos);
  } catch (err) {
    logger.error('Error fetching pedidos: %o', err);
    res.status(500).json({ message: 'Error fetching pedidos' });
  }
};

// ---------------- Obtener un pedido por ID ----------------
export const getPedidoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pedidoRepository = AppDataSource.getRepository(Pedidos);
    const pedido = await pedidoRepository.findOne({ where: { id_pedido: Number(id) } }); // Atributo actualizado

    if (!pedido) {
      logger.warn('Pedido not found for id_pedido: %s', id);
      return res.status(404).json({ message: 'Pedido not found' });
    }

    res.status(200).json(pedido);
  } catch (err) {
    logger.error('Error fetching Pedido by ID: %o', err);
    res.status(500).json({ message: 'Error fetching pedido by ID' });
  }
};

// ---------------- Actualizar un pedido ----------------
export const updatePedido = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for updatePedido: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for pedido', errors: validationResult.errors });
  }

  const {
    id_cliente,
    id_proveedor,
    tipo_pedido,
    fecha_pedido,
    fecha_entrega,
    comentarios,
    estado,
  } = req.body;

  try {
    const pedidoRepository = AppDataSource.getRepository(Pedidos);

    // Verificar si el pedido existe
    const pedido = await pedidoRepository.findOne({ where: { id_pedido: Number(id) } });
    if (!pedido) {
      logger.warn('Pedido not found for id_pedido: %s', id);
      return res.status(404).json({ message: 'Pedido not found' });
    }

    // Actualizar el pedido
    pedido.cliente = id_cliente;
    pedido.proveedor = id_proveedor;
    pedido.tipo_pedido = tipo_pedido;
    pedido.fecha_pedido = fecha_pedido;
    pedido.fecha_entrega = fecha_entrega;
    pedido.comentarios = comentarios;
    pedido.estado = estado;

    await pedidoRepository.save(pedido);
    logger.info('Pedido updated: %o', pedido);
    res.status(200).json(pedido);
  } catch (err) {
    logger.error('Error updating Pedido: %o', err);
    res.status(500).json({ message: 'Error updating pedido' });
  }
};

// ---------------- Eliminar un pedido ----------------
export const deletePedido = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pedidoRepository = AppDataSource.getRepository(Pedidos);

    // Verificar si el pedido existe
    const pedido = await pedidoRepository.findOne({ where: { id_pedido: Number(id) } });
    if (!pedido) {
      logger.warn('Pedido not found for id_pedido: %s', id);
      return res.status(404).json({ message: 'Pedido not found' });
    }

    await pedidoRepository.remove(pedido);
    logger.info('Pedido deleted: %o', pedido);
    res.status(200).json({ message: 'Pedido deleted successfully' });
  } catch (err) {
    logger.error('Error deleting Pedido: %o', err);
    res.status(500).json({ message: 'Error deleting pedido' });
  }
};
