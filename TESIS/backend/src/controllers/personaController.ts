import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Persona } from '../entities/personaEntity';
import { ZodValidatorAdapter } from '../plugins/zod-validator-plugin';
import { personaSchemaRegistro, personaSchemaActualizacion } from '../schemas/personaSchema';
import logger from '../utils/logger';

// * Crear una persona
export const createPersona = async (req: Request, res: Response) => {
  const adapter = new ZodValidatorAdapter(personaSchemaRegistro);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createPersona: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  const { rut_persona, nombre, primer_apellido, segundo_apellido, email, telefono } = validationResult.data;

  try {
    const personaRepository = AppDataSource.getRepository(Persona);

    // Verificar si el rut_persona ya existe
    const existingPersonaByRut = await personaRepository.findOne({ where: { rut_persona } });
    if (existingPersonaByRut) {
      logger.warn('Persona already exists with rut_persona: %s', rut_persona);
      return res.status(409).json({ message: 'rut_persona ya está registrado' });
    }

    // Verificar si el email ya existe
    if (email) {
      const existingPersonaByEmail = await personaRepository.findOne({ where: { email } });
      if (existingPersonaByEmail) {
        logger.warn('Persona already exists with email: %s', email);
        return res.status(409).json({ message: 'Email ya está registrado' });
      }
    }

    const newPersona = personaRepository.create({
      rut_persona,
      nombre,
      primer_apellido,
      segundo_apellido: segundo_apellido || '',
      email: email || '',
      telefono,
    });
    await personaRepository.save(newPersona);

    logger.info('Persona created: %o', newPersona);
    res.status(201).json(newPersona);
  } catch (err) {
    logger.error('Error creating Persona: %o', err);
    if (err instanceof Error) {
      if (err.message.includes('duplicate key value violates unique constraint')) {
        if (err.message.includes('uq_6c840ee74b24bf5e892082a5d60')) {
          logger.warn('Duplicate rut_persona error: %s', err.message);
          res.status(409).json({ message: 'rut_persona ya está registrado' });
        } else if (err.message.includes('email')) {
          logger.warn('Duplicate email error: %s', err.message);
          res.status(409).json({ message: 'Email ya está registrado' });
        } else {
          logger.error('Unknown duplicate key error: %o', err);
          res.status(409).json({ message: 'Duplicate key error' });
        }
      } else {
        logger.error('Error creating Persona: %o', err);
        res.status(500).json({ message: err.message });
      }
    } else {
      logger.error('Unknown error creating Persona: %o', err);
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

/*
  Se esperan recibir los siguientes valores:
      Nombre, 
      Primer_apellido, 
      Segundo_apellido, 
      Email, 
      Telefono 
*/

// * Actualizar una persona
// * Actualizar una persona
export const updatePersona = async (req: Request, res: Response) => {
  const { id } = req.params;
  const adapter = new ZodValidatorAdapter(personaSchemaActualizacion);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for updatePersona: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  const { nombre, primer_apellido, segundo_apellido, email, telefono } = validationResult.data;

  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const persona = await personaRepository.findOne({ where: { id_persona: parseInt(id) } });

    if (!persona) {
      logger.warn('Persona not found: %s', id);
      return res.status(404).json({ message: 'Persona not found' });
    }

    if (nombre) persona.nombre = nombre;
    if (primer_apellido) persona.primer_apellido = primer_apellido;
    if (segundo_apellido !== undefined) persona.segundo_apellido = segundo_apellido;
    if (email !== undefined) persona.email = email;
    if (telefono) persona.telefono = telefono;

    await personaRepository.save(persona);
    logger.info('Persona updated: %o', persona);
    res.status(200).json(persona);
  } catch (err) {
    logger.error('Error updating Persona: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// * Obtener todas las personas
/* Obtener todas las personas disponibles en la base de datos */
export const getAllPersonas = async (req: Request, res: Response) => {
  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const personas = await personaRepository.find();
    logger.info('Fetched all personas');
    res.status(200).json(personas);
  } catch (err) {
    logger.error('Error fetching all personas: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};


// * Obtener una persona por su ID
export const getPersonaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validar que el ID sea un número válido
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    logger.warn('Formato de ID inválido: %s', id);
    return res.status(400).json({ message: 'Formato de ID inválido' });
  }
  
  try {
    const personaRepository = AppDataSource.getRepository(Persona);

    // Buscar la persona por el ID
    const persona = await personaRepository.findOne({ where: { id_persona: parsedId } });

    if (!persona) {
      logger.warn('Persona no encontrada: %s', id);
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    logger.info('Persona obtenida por ID: %s', id);
    res.status(200).json(persona);
  } catch (err) {
    logger.error('Error al obtener la persona por ID: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Ocurrió un error desconocido' });
    }
  }
};


// * Buscar personas por criterios
export const searchPersonas = async (req: Request, res: Response) => {
  const { nombre, apellido, email } = req.query;

  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const queryBuilder = personaRepository.createQueryBuilder('persona');

    // Filtros basados en los criterios proporcionados
    if (typeof nombre === 'string') {
      queryBuilder.andWhere(
        "unaccent(lower(persona.nombre)) LIKE unaccent(lower(:nombre))",
        { nombre: `%${nombre}%` }
      );
    }
    if (typeof apellido === 'string') {
      queryBuilder.andWhere(
        "unaccent(lower(persona.primer_apellido)) LIKE unaccent(lower(:apellido)) OR unaccent(lower(persona.segundo_apellido)) LIKE unaccent(lower(:apellido))",
        { apellido: `%${apellido}%` }
      );
    }
    if (typeof email === 'string') {
      queryBuilder.andWhere(
        "unaccent(lower(persona.email)) LIKE unaccent(lower(:email))",
        { email: `%${email.trim()}%` }
      );
    }

    // Obtener los resultados
    const personas = await queryBuilder.getMany();
    logger.info('Personas buscadas con los criterios proporcionados');
    res.status(200).json(personas);
  } catch (err) {
    logger.error('Error al buscar personas: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Ocurrió un error desconocido' });
    }
  }
};



// * Contar el número total de personas
export const countPersonas = async (req: Request, res: Response) => {
  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const total = await personaRepository.count(); // Cambiado el nombre de la variable a `total` para mayor claridad
    logger.info('Total de personas contadas: %d', total);
    res.status(200).json({ total });
  } catch (err) {
    logger.error('Error al contar personas: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Ocurrió un error desconocido' });
    }
  }
};


// * Eliminar una persona por su ID
/* Para acceder a esta función se debe de dar el ID por parámetro */
export const deletePersona = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const personaRepository = AppDataSource.getRepository(Persona);

    // Buscar la persona por su ID
    const persona = await personaRepository.findOne({ where: { id_persona: parseInt(id) } });

    if (!persona) {
      logger.warn('Persona no encontrada: %s', id);
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    // Eliminar la persona
    await personaRepository.remove(persona);
    logger.info('Persona eliminada: %s', id);
    res.status(200).json({ message: 'Persona eliminada exitosamente' });
  } catch (err) {
    logger.error('Error al eliminar la persona: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Ocurrió un error desconocido' });
    }
  }
};
