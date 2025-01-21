import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Devoluciones } from '../../entities/productos/devolucionesEntity';
import { devolucionesSchema } from '../../schemas/productos/devolucionesSchema';
import { ZodValidatorAdapter } from '../../plugins/zod-validator-plugin';
import logger from '../../utils/logger';

// Instancia del adaptador de validación
const validator = new ZodValidatorAdapter(devolucionesSchema);

// ---------------- Crear una devolución ----------------
export const createDevolucion = async (req: Request, res: Response) => {
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createDevolucion: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for devolución', errors: validationResult.errors });
  }

  const {
    id_producto,
    cantidad_unidades,
    cantidad_cajas,
    fecha_devolucion,
    razon,
  } = req.body;

  try {
    const devolucionesRepository = AppDataSource.getRepository(Devoluciones);
    const newDevolucion = devolucionesRepository.create({
      id_producto,
      cantidad_unidades,
      cantidad_cajas,
      fecha_devolucion,
      razon,
    });
    await devolucionesRepository.save(newDevolucion);
    logger.info('Devolución created: %o', newDevolucion);
    res.status(201).json(newDevolucion);
  } catch (err) {
    logger.error('Error creating devolución: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener todas las devoluciones ----------------
export const getAllDevoluciones = async (req: Request, res: Response) => {
  try {
    const devolucionesRepository = AppDataSource.getRepository(Devoluciones);
    const devoluciones = await devolucionesRepository.find();
    res.status(200).json(devoluciones);
  } catch (err) {
    logger.error('Error fetching devoluciones: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener una devolución por ID ----------------
export const getDevolucionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const devolucionesRepository = AppDataSource.getRepository(Devoluciones);
    const devolucion = await devolucionesRepository.findOne({ where: { id_devolucion: Number(id) } });

    if (!devolucion) {
      logger.warn('Devolución not found for id_devolucion: %s', id);
      return res.status(404).json({ message: 'Devolución not found' });
    }

    res.status(200).json(devolucion);
  } catch (err) {
    logger.error('Error fetching devolución by ID: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Actualizar una devolución ----------------
export const updateDevolucion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for updateDevolucion: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for devolución', errors: validationResult.errors });
  }

  const {
    id_producto,
    cantidad_unidades,
    cantidad_cajas,
    fecha_devolucion,
    razon,
  } = req.body;

  try {
    const devolucionesRepository = AppDataSource.getRepository(Devoluciones);

    // Verificar si la devolución existe
    const devolucion = await devolucionesRepository.findOne({ where: { id_devolucion: Number(id) } });
    if (!devolucion) {
      logger.warn('Devolución not found for id_devolucion: %s', id);
      return res.status(404).json({ message: 'Devolución not found' });
    }

    // Actualizar la devolución
    devolucion.id_producto = id_producto;
    devolucion.cantidad_unidades = cantidad_unidades;
    devolucion.cantidad_cajas = cantidad_cajas;
    devolucion.fecha_devolucion = fecha_devolucion;
    devolucion.razon = razon;

    await devolucionesRepository.save(devolucion);
    logger.info('Devolución updated: %o', devolucion);
    res.status(200).json(devolucion);
  } catch (err) {
    logger.error('Error updating devolución: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Eliminar una devolución ----------------
export const deleteDevolucion = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const devolucionesRepository = AppDataSource.getRepository(Devoluciones);

    // Verificar si la devolución existe
    const devolucion = await devolucionesRepository.findOne({ where: { id_devolucion: Number(id) } });
    if (!devolucion) {
      logger.warn('Devolución not found for id_devolucion: %s', id);
      return res.status(404).json({ message: 'Devolución not found' });
    }

    await devolucionesRepository.remove(devolucion);
    logger.info('Devolución deleted: %o', devolucion);
    res.status(200).json({ message: 'Devolución deleted successfully' });
  } catch (err) {
    logger.error('Error deleting devolución: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
