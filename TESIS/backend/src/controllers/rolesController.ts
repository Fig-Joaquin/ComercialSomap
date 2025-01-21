import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Rol } from '../entities/rolesEntity'; 
import { rolesSchema } from '../schemas/rolesSchema';
import { ZodValidatorAdapter } from '../plugins/zod-login-plugin';
import logger from '../utils/logger';

// * Crear un rol
export const createRol = async (req: Request, res: Response) => {
  const adapter = new ZodValidatorAdapter(rolesSchema);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (!validationResult.success) {
    logger.error('Invalid input for createRol: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  const { rol } = validationResult.data;

  try {
    const rolRepository = AppDataSource.getRepository(Rol); // Repositorio para Rol
    const existingRol = await rolRepository.findOne({ where: { rol } });
    if (existingRol) {
      return res.status(409).json({ message: 'Rol already exists' });
    }

    const newRol = rolRepository.create({ rol });
    await rolRepository.save(newRol);

    logger.info('Rol created: %o', newRol);
    res.status(201).json(newRol);
  } catch (err) {
    logger.error('Error creating Rol: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Obtener todos los roles
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const rolRepository = AppDataSource.getRepository(Rol);
    const roles = await rolRepository.find();
    res.status(200).json(roles);
  } catch (err) {
    logger.error('Error fetching roles: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Actualizar un rol
export const updateRol = async (req: Request, res: Response) => {
  const { id } = req.params;
  const adapter = new ZodValidatorAdapter(rolesSchema);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (!validationResult.success) {
    logger.error('Invalid input for updateRol: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  const { rol } = req.body;

  try {
    const rolRepository = AppDataSource.getRepository(Rol);
    const existingRol = await rolRepository.findOne({ where: { id_rol: Number(id) } });

    if (!existingRol) {
      return res.status(404).json({ message: 'Rol not found' });
    }

    const duplicateRol = await rolRepository.findOne({ where: { rol } });
    if (duplicateRol && duplicateRol.id_rol !== Number(id)) {
      return res.status(409).json({ message: 'Rol already exists' });
    }

    existingRol.rol = rol;
    await rolRepository.save(existingRol);

    logger.info('Rol updated: %o', existingRol);
    res.status(200).json(existingRol);
  } catch (err) {
    logger.error('Error updating Rol: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Eliminar un rol
export const deleteRol = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const rolRepository = AppDataSource.getRepository(Rol);
    const rol = await rolRepository.findOne({ where: { id_rol: Number(id) } });

    if (!rol) {
      return res.status(404).json({ message: 'Rol not found' });
    }

    await rolRepository.remove(rol);

    logger.info('Rol deleted: %o', rol);
    res.status(200).json({ message: 'Rol deleted successfully' });
  } catch (err) {
    logger.error('Error deleting Rol: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
