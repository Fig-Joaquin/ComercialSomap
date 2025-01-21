import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { RolUsuario } from '../entities/rolUsuarioEntity';
import { Usuario } from '../entities/usuarioEntity';
import { Rol } from '../entities/rolesEntity';
import { rolUsuarioSchema } from '../schemas/rolUsuarioSchema';
import { ZodValidatorAdapter } from '../plugins/zod-plugin';
import logger from '../utils/logger';

// * Asignar un rol a un usuario
export const createRolUsuario = async (req: Request, res: Response) => {
  const adapter = new ZodValidatorAdapter(rolUsuarioSchema);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createRolUsuario: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  const { id_usuario, id_rol } = validationResult.data;

  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const rolRepository = AppDataSource.getRepository(Rol);
    const rolUsuarioRepository = AppDataSource.getRepository(RolUsuario);

    const usuario = await usuarioRepository.findOne({ where: { id_usuario } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario not found' });
    }

    const rol = await rolRepository.findOne({ where: { id_rol } });
    if (!rol) {
      return res.status(404).json({ message: 'Rol not found' });
    }

    const existingRolUsuario = await rolUsuarioRepository.findOne({
      where: { usuario: { id_usuario }, rol: { id_rol } },
    });
    if (existingRolUsuario) {
      return res.status(409).json({ message: 'Rol already assigned to this user' });
    }

    const newRolUsuario = rolUsuarioRepository.create({ usuario, rol });
    await rolUsuarioRepository.save(newRolUsuario);

    logger.info('RolUsuario created: %o', newRolUsuario);
    res.status(201).json(newRolUsuario);
  } catch (err) {
    logger.error('Error creating RolUsuario: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Obtener todos los roles de usuarios
export const getAllRolUsuarios = async (req: Request, res: Response) => {
  try {
    const rolUsuarioRepository = AppDataSource.getRepository(RolUsuario);
    const rolUsuarios = await rolUsuarioRepository.find({ relations: ['usuario', 'rol'] });
    res.status(200).json(rolUsuarios);
  } catch (err) {
    logger.error('Error fetching rolUsuarios: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Eliminar un rol de usuario
export const deleteRolUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const rolUsuarioRepository = AppDataSource.getRepository(RolUsuario);
    const rolUsuario = await rolUsuarioRepository.findOne({
      where: { id_rol_usuario: Number(id) },
      relations: ['usuario', 'rol'],
    });

    if (!rolUsuario) {
      return res.status(404).json({ message: 'RolUsuario not found' });
    }

    await rolUsuarioRepository.remove(rolUsuario);

    logger.info('RolUsuario deleted: %o', rolUsuario);
    res.status(200).json({ message: 'RolUsuario deleted successfully' });
  } catch (err) {
    logger.error('Error deleting RolUsuario: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};


// ? Asignar un rol a un usuario VERIFICA TOKEN (??)
// export const createRolUsuario = async (req: Request, res: Response) => {
//   const adapter = new ZodValidatorAdapter(rolUsuarioSchema);
//   const validationResult = adapter.validateAndSanitize(req.body);

//   if (validationResult) {
//     logger.error('Invalid input for createRolUsuario: %o', validationResult.errors);
//     return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
//   }

//   const { ID_Usuario, ID_Rol } = req.body;

//   try {
//     const usuarioRepository = AppDataSource.getRepository(Usuario);
//     const rolesRepository = AppDataSource.getRepository(Roles);
//     const rolUsuarioRepository = AppDataSource.getRepository(RolUsuario);

//     const usuario = await usuarioRepository.findOne({ where: { ID_Usuario } });
//     if (!usuario) {
//       return res.status(404).json({ message: 'Usuario not found' });
//     }

//     const rol = await rolesRepository.findOne({ where: { ID_Rol } });
//     if (!rol) {
//       return res.status(404).json({ message: 'Rol not found' });
//     }

//     const existingRolUsuario = await rolUsuarioRepository.findOne({ where: { usuario: { ID_Usuario }, rol: { ID_Rol } } });
//     if (existingRolUsuario) {
//       return res.status(409).json({ message: 'Rol already assigned to this user' });
//     }

//     const newRolUsuario = rolUsuarioRepository.create({ usuario, rol });
//     await rolUsuarioRepository.save(newRolUsuario);

//     logger.info('RolUsuario created: %o', newRolUsuario);
//     res.status(201).json(newRolUsuario);
//   } catch (err) {
//     logger.error('Error creating RolUsuario: %o', err);
//     if (err instanceof Error) {
//       res.status(500).json({ message: err.message });
//     } else {
//       res.status(500).json({ message: 'An unknown error occurred' });
//     }
//   }
// };