import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Persona } from '../entities/personaEntity';
import { Usuario } from '../entities/usuarioEntity';
import { ZodValidatorAdapter } from '../plugins/zod-validator-plugin';
import { usuarioSchema } from '../schemas/usuarioSchema';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger';

// * Crear un usuario
export const createUsuario = async (req: Request, res: Response) => {
  const adapter = new ZodValidatorAdapter(usuarioSchema);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult && !validationResult.success) {
    logger.error('Invalid input for createUsuario: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  const { rut_persona, contrasenia } = validationResult.data;

  // Convertir rut_persona a minúsculas
  const lowerCaseRut = rut_persona.toLowerCase();

  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const persona = await personaRepository.findOne({ where: { rut_persona: lowerCaseRut } });

    if (!persona) {
      logger.error('Persona not found with rut_persona: %s', lowerCaseRut);
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const existingUsuario = await usuarioRepository.findOne({ where: { persona: { rut_persona: lowerCaseRut } } });

    if (existingUsuario) {
      logger.error('Usuario already exists with rut_persona: %s', lowerCaseRut);
      return res.status(409).json({ message: 'El usuario ya se encuentra registrado' });
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    const newUsuario = usuarioRepository.create({
      persona,
      contrasenia: hashedPassword,
    });
    await usuarioRepository.save(newUsuario);

    logger.info('Usuario created: %o', newUsuario);
    res.status(201).json(newUsuario);
  } catch (err) {
    logger.error('Error creating usuario: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Actualizar contraseña de un Usuario a través del RUT
export const updateUsuario = async (req: Request, res: Response) => {
  const { id } = req.params; // Aquí id se refiere al RUT de la persona
  const adapter = new ZodValidatorAdapter(usuarioSchema.pick({ contrasenia: true }));
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult && !validationResult.success) {
    logger.error('Invalid input for updateUsuario: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  const { contrasenia } = validationResult.data;

  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOne({ where: { persona: { rut_persona: id } }, relations: ['persona'] });

    if (!usuario) {
      logger.error('Usuario not found: %s', id);
      return res.status(404).json({ message: 'Usuario not found' });
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10);
    usuario.contrasenia = hashedPassword;

    await usuarioRepository.save(usuario);
    logger.info('Usuario updated: %o', usuario);
    res.status(200).json(usuario);
  } catch (err) {
    logger.error('Error updating usuario: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Obtener todos los usuarios
export const getAllUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuarios = await usuarioRepository.find({ relations: ['persona'] });
    res.status(200).json(usuarios);
  } catch (err) {
    logger.error('Error fetching usuarios: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Obtener un usuario por su ID
export const getUsuarioById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const usuarioId = parseInt(id, 10);
    if (isNaN(usuarioId)) {
      logger.error('Invalid ID format: %s', id);
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOne({ where: { id_usuario: usuarioId }, relations: ['persona'] });

    if (!usuario) {
      logger.error('Usuario not found: %s', id);
      return res.status(404).json({ message: 'Usuario not found' });
    }

    res.status(200).json(usuario);
  } catch (err) {
    logger.error('Error fetching usuario: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Eliminar un usuario por su ID
export const deleteUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const usuarioId = parseInt(id, 10);
    if (isNaN(usuarioId)) {
      logger.error('Invalid ID format: %s', id);
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOne({ where: { id_usuario: usuarioId }, relations: ['persona'] });

    if (!usuario) {
      logger.error('Usuario not found: %s', id);
      return res.status(404).json({ message: 'Usuario not found' });
    }

    await usuarioRepository.remove(usuario);
    logger.info('Usuario deleted: %o', usuario);
    res.status(200).json({ message: 'Usuario deleted successfully' });
  } catch (err) {
    logger.error('Error deleting usuario: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Restablecer la contraseña de un usuario
export const resetUsuarioPassword = async (req: Request, res: Response) => {
  const adapter = new ZodValidatorAdapter(usuarioSchema.pick({ rut_persona: true, contrasenia: true }));
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult && !validationResult.success) {
    logger.error('Invalid input for resetUsuarioPassword: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  const { rut_persona, contrasenia } = validationResult.data;

  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOne({ where: { persona: { rut_persona } }, relations: ['persona'] });

    if (!usuario) {
      logger.error('Usuario not found with rut_persona: %s', rut_persona);
      return res.status(404).json({ message: 'Usuario not found' });
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10);
    usuario.contrasenia = hashedPassword;

    await usuarioRepository.save(usuario);
    logger.info('Usuario password reset: %o', usuario);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    logger.error('Error resetting usuario password: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
