import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Region } from '../entities/regionEntity';
import { regionSchema } from '../schemas/regionSchema';
import logger from '../utils/logger';

// * Crear una región
export const createRegion = async (req: Request, res: Response) => {
  // Validar los datos de la región
  const parseResult = regionSchema.safeParse(req.body);
  
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid input for region', errors: parseResult.error.errors });
  }

  const { nombre } = parseResult.data;

  try {
    const regionRepository = AppDataSource.getRepository(Region);
    const newRegion = regionRepository.create({ nombre });
    await regionRepository.save(newRegion);
    res.status(201).json(newRegion);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Obtener todas las regiones
export const getAllRegiones = async (req: Request, res: Response) => {
  try {
    const regionRepository = AppDataSource.getRepository(Region);
    const regiones = await regionRepository.find({ relations: ['comunas'] });
    res.status(200).json(regiones);
  } catch (err) {
    logger.error('Error fetching regiones: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Obtener una región por su ID
export const getRegionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const regionRepository = AppDataSource.getRepository(Region);
    const region = await regionRepository.findOne({ where: { id_region: Number(id) }, relations: ['comunas'] });

    if (!region) {
      logger.warn('Region not found for ID: %s', id);
      return res.status(404).json({ message: 'Region not found' });
    }

    res.status(200).json(region);
  } catch (err) {
    logger.error('Error fetching region by ID: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Actualizar una región
export const updateRegion = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validar los datos de la región
  const parseResult = regionSchema.safeParse(req.body);
  if (!parseResult.success) {
    logger.error('Invalid input for updateRegion: %o', parseResult.error.errors);
    return res.status(400).json({ message: 'Invalid input for region', errors: parseResult.error.errors });
  }

  const { nombre } = parseResult.data;

  try {
    const regionRepository = AppDataSource.getRepository(Region);

    // Verificar si la región existe
    const region = await regionRepository.findOne({ where: { id_region: Number(id) } });
    if (!region) {
      logger.warn('Region not found for ID: %s', id);
      return res.status(404).json({ message: 'Region not found' });
    }

    // Actualizar la región
    region.nombre = nombre;
    await regionRepository.save(region);
    logger.info('Region updated: %o', region);
    res.status(200).json(region);
  } catch (err) {
    logger.error('Error updating region: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Eliminar una región
export const deleteRegion = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const regionRepository = AppDataSource.getRepository(Region);

    // Verificar si la región existe
    const region = await regionRepository.findOne({ where: { id_region: Number(id) } });
    if (!region) {
      logger.warn('Region not found for ID: %s', id);
      return res.status(404).json({ message: 'Region not found' });
    }

    await regionRepository.remove(region);
    logger.info('Region deleted: %o', region);
    res.status(200).json({ message: 'Region deleted successfully' });
  } catch (err) {
    logger.error('Error deleting region: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
