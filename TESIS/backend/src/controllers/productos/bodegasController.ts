import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Bodegas } from '../../entities/productos/bodegasEntity';
import { bodegaSchema } from '../../schemas/productos/bodegasSchema';
import { ZodValidatorAdapter } from '../../plugins/zod-validator-plugin';
import logger from '../../utils/logger';

// Instancia del adaptador de validación
const validator = new ZodValidatorAdapter(bodegaSchema);

// ---------------- Crear una bodega ----------------
export const createBodega = async (req: Request, res: Response) => {
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createBodega: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for bodega', errors: validationResult.errors });
  }

  const { nombre, direccion } = req.body; // Atributos en minúsculas

  try {
    const bodegaRepository = AppDataSource.getRepository(Bodegas);
    const newBodega = bodegaRepository.create({ nombre, direccion });
    await bodegaRepository.save(newBodega);
    logger.info('Bodega created: %o', newBodega);
    res.status(201).json(newBodega);
  } catch (err) {
    logger.error('Error creating Bodega: %o', err);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};

// ---------------- Obtener todas las bodegas ----------------
export const getAllBodegas = async (req: Request, res: Response) => {
  try {
    const bodegaRepository = AppDataSource.getRepository(Bodegas);
    const bodegas = await bodegaRepository.find();
    res.status(200).json(bodegas);
  } catch (err) {
    logger.error('Error fetching bodegas: %o', err);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};

// ---------------- Obtener una bodega por ID ----------------
export const getBodegaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const bodegaRepository = AppDataSource.getRepository(Bodegas);
    const bodega = await bodegaRepository.findOne({ where: { id_bodega: Number(id) } }); // Atributo ajustado a minúsculas

    if (!bodega) {
      logger.warn('Bodega not found for id_bodega: %s', id);
      return res.status(404).json({ message: 'Bodega not found' });
    }

    res.status(200).json(bodega);
  } catch (err) {
    logger.error('Error fetching Bodega by ID: %o', err);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};

// ---------------- Actualizar una bodega ----------------
export const updateBodega = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for updateBodega: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for bodega', errors: validationResult.errors });
  }

  const { nombre, direccion } = req.body; // Atributos en minúsculas

  try {
    const bodegaRepository = AppDataSource.getRepository(Bodegas);

    // Verificar si la bodega existe
    const bodega = await bodegaRepository.findOne({ where: { id_bodega: Number(id) } }); // Atributo ajustado a minúsculas
    if (!bodega) {
      logger.warn('Bodega not found for id_bodega: %s', id);
      return res.status(404).json({ message: 'Bodega not found' });
    }

    // Actualizar la bodega
    bodega.nombre = nombre;
    bodega.direccion = direccion;

    await bodegaRepository.save(bodega);
    logger.info('Bodega updated: %o', bodega);
    res.status(200).json(bodega);
  } catch (err) {
    logger.error('Error updating Bodega: %o', err);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};

// ---------------- Eliminar una bodega ----------------
export const deleteBodega = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const bodegaRepository = AppDataSource.getRepository(Bodegas);

    // Verificar si la bodega existe
    const bodega = await bodegaRepository.findOne({ where: { id_bodega: Number(id) } }); // Atributo ajustado a minúsculas
    if (!bodega) {
      logger.warn('Bodega not found for id_bodega: %s', id);
      return res.status(404).json({ message: 'Bodega not found' });
    }

    await bodegaRepository.remove(bodega);
    logger.info('Bodega deleted: %o', bodega);
    res.status(200).json({ message: 'Bodega deleted successfully' });
  } catch (err) {
    logger.error('Error deleting Bodega: %o', err);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};
