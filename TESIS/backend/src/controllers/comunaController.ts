import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Comuna } from '../entities/comunaEntity';
import { comunaSchema } from '../schemas/comunaSchema';
import { ZodValidatorAdapter } from '../plugins/zod-validator-plugin';
import { Region } from '../entities/regionEntity';
import logger from '../utils/logger';

// Crear una instancia del adaptador de validación
const validator = new ZodValidatorAdapter(comunaSchema);

// * Crear una comuna
export const createComuna = async (req: Request, res: Response) => {
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createComuna: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for comuna', errors: validationResult.errors });
  }

  const { nombre, id_region } = req.body;

  try {
    const comunaRepository = AppDataSource.getRepository(Comuna);
    const regionRepository = AppDataSource.getRepository(Region);

    // Verificar si la región existe
    const region = await regionRepository.findOne({ where: { id_region } });
    if (!region) {
      logger.warn('Region not found for id_region: %s', id_region);
      return res.status(404).json({ message: 'Region not found' });
    }

    const newComuna = comunaRepository.create({ nombre, region });
    await comunaRepository.save(newComuna);
    logger.info('Comuna created: %o', newComuna);
    res.status(201).json(newComuna);
  } catch (err) {
    logger.error('Error creating Comuna: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Obtener todas las comunas
export const getAllComunas = async (req: Request, res: Response) => {
  try {
    const comunaRepository = AppDataSource.getRepository(Comuna);
    const comunas = await comunaRepository.find({ relations: ['region'] });
    res.status(200).json(comunas);
  } catch (err) {
    logger.error('Error fetching comunas: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Obtener una comuna por ID
export const getComunaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const comunaRepository = AppDataSource.getRepository(Comuna);
    const comuna = await comunaRepository.findOne({ where: { id_comuna: Number(id) }, relations: ['region'] });

    if (!comuna) {
      logger.warn('Comuna not found for id_comuna: %s', id);
      return res.status(404).json({ message: 'Comuna not found' });
    }

    res.status(200).json(comuna);
  } catch (err) {
    logger.error('Error fetching Comuna by ID: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Actualizar una comuna
export const updateComuna = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for updateComuna: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for comuna', errors: validationResult.errors });
  }

  const { nombre, id_region } = req.body;

  try {
    const comunaRepository = AppDataSource.getRepository(Comuna);
    const regionRepository = AppDataSource.getRepository(Region);

    // Verificar si la comuna existe
    const comuna = await comunaRepository.findOne({ where: { id_comuna: Number(id) } });
    if (!comuna) {
      logger.warn('Comuna not found for id_comuna: %s', id);
      return res.status(404).json({ message: 'Comuna not found' });
    }

    // Verificar si la región existe
    const region = await regionRepository.findOne({ where: { id_region } });
    if (!region) {
      logger.warn('Region not found for id_region: %s', id_region);
      return res.status(404).json({ message: 'Region not found' });
    }

    // Actualizar la comuna
    comuna.nombre = nombre;
    comuna.region = region;

    await comunaRepository.save(comuna);
    logger.info('Comuna updated: %o', comuna);
    res.status(200).json(comuna);
  } catch (err) {
    logger.error('Error updating Comuna: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Eliminar una comuna
export const deleteComuna = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const comunaRepository = AppDataSource.getRepository(Comuna);

    // Verificar si la comuna existe
    const comuna = await comunaRepository.findOne({ where: { id_comuna: Number(id) } });
    if (!comuna) {
      logger.warn('Comuna not found for id_comuna: %s', id);
      return res.status(404).json({ message: 'Comuna not found' });
    }

    await comunaRepository.remove(comuna);
    logger.info('Comuna deleted: %o', comuna);
    res.status(200).json({ message: 'Comuna deleted successfully' });
  } catch (err) {
    logger.error('Error deleting Comuna: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
