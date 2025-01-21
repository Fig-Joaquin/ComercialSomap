import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Sueldo } from '../entities/sueldoEntity';
import { Transaccion } from '../entities/transaccionEntity';
import { ZodValidatorAdapter } from '../plugins/zod-validator-plugin';
import { sueldoSchemaRegistro, sueldoSchemaActualizacion } from '../schemas/sueldoSchema';
import logger from '../utils/logger';

const sueldoRepository = AppDataSource.getRepository(Sueldo);
const transaccionRepository = AppDataSource.getRepository(Transaccion);

// Crear sueldo con transacción
export const createSueldo = async (req: Request, res: Response): Promise<Response> => {
  const adapter = new ZodValidatorAdapter(sueldoSchemaRegistro);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult.errors) {
    logger.error('Invalid input for createSueldo: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  const { fecha, tipo, monto, descripcion_transaccion, tipo_sueldo, descripcion } = validationResult.data;

  const [day, month, year] = fecha.split('-').map(Number);
  const fechaConvertida = new Date(year, month - 1, day);

  try {
    const nuevaTransaccion = transaccionRepository.create({
      fecha: fechaConvertida,
      tipo,
      monto,
      descripcion: descripcion_transaccion,
    });
    await transaccionRepository.save(nuevaTransaccion);

    const nuevoSueldo = sueldoRepository.create({
      id_transaccion: nuevaTransaccion,
      tipo_sueldo,
      descripcion,
    });
    await sueldoRepository.save(nuevoSueldo);

    logger.info('Sueldo y transacción creados: %o %o', nuevoSueldo, nuevaTransaccion);
    return res.status(201).json({ nuevoSueldo, nuevaTransaccion });
  } catch (error) {
    logger.error('Error al crear el sueldo y la transacción: %o', error);
    return res.status(500).json({ message: 'Error al crear el sueldo y la transacción' });
  }
};

// Actualizar sueldo
export const updateSueldo = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const adapter = new ZodValidatorAdapter(sueldoSchemaActualizacion);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult.errors) {
    logger.error('Invalid input for updateSueldo: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  try {
    const sueldo = await sueldoRepository.findOneBy({ id_sueldo: parseInt(id) });
    if (!sueldo) {
      logger.warn('Sueldo no encontrado: %s', id);
      return res.status(404).json({ message: 'Sueldo no encontrado' });
    }

    if (validationResult.data.id_transaccion !== undefined) sueldo.id_transaccion = validationResult.data.id_transaccion;
    if (validationResult.data.tipo_sueldo !== undefined) sueldo.tipo_sueldo = validationResult.data.tipo_sueldo;
    if (validationResult.data.descripcion !== undefined) sueldo.descripcion = validationResult.data.descripcion;

    await sueldoRepository.save(sueldo);
    logger.info('Sueldo actualizado: %o', sueldo);
    return res.status(200).json(sueldo);
  } catch (error) {
    logger.error('Error al actualizar el sueldo: %o', error);
    return res.status(500).json({ message: 'Error al actualizar el sueldo' });
  }
};

// Eliminar sueldo
export const deleteSueldo = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const sueldo = await sueldoRepository.findOneBy({ id_sueldo: parseInt(id) });
    if (!sueldo) {
      logger.warn('Sueldo no encontrado: %s', id);
      return res.status(404).json({ message: 'Sueldo no encontrado' });
    }

    await sueldoRepository.remove(sueldo);
    logger.info('Sueldo eliminado: %o', sueldo);
    return res.status(200).json({ message: 'Sueldo eliminado correctamente' });
  } catch (error) {
    logger.error('Error al eliminar el sueldo: %o', error);
    return res.status(500).json({ message: 'Error al eliminar el sueldo' });
  }
};

// Obtener todos los sueldos
export const getAllSueldos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const sueldos = await sueldoRepository.find();
    logger.info('Sueldos obtenidos');
    return res.status(200).json(sueldos);
  } catch (error) {
    logger.error('Error al obtener los sueldos: %o', error);
    return res.status(500).json({ message: 'Error al obtener los sueldos' });
  }
};

// Filtrar sueldos por tipo y periodo
export const getSueldosByTipo = async (req: Request, res: Response): Promise<Response> => {
  const { tipo, periodo } = req.query;

  try {
    let query = sueldoRepository.createQueryBuilder('sueldo')
      .leftJoinAndSelect('sueldo.id_transaccion', 'transaccion')
      .where('sueldo.tipo_sueldo = :tipo', { tipo });

    if (tipo === 'mensual') {
      query = query.andWhere('DATE_PART(\'month\', transaccion.fecha) = :mes', { mes: periodo });
    } else if (tipo === 'semanal') {
      query = query.andWhere('DATE_PART(\'week\', transaccion.fecha) = :semana', { semana: periodo });
    } else if (tipo === 'quincena') {
      query = query.andWhere('DATE_PART(\'month\', transaccion.fecha) = :mes', { mes: periodo })
        .andWhere('EXTRACT(DAY FROM transaccion.fecha) <= 15');
    }

    const sueldos = await query.getMany();
    logger.info(`Sueldos filtrados por tipo ${tipo} y periodo ${periodo} obtenidos`);
    return res.status(200).json(sueldos);
  } catch (error) {
    logger.error(`Error al obtener los sueldos filtrados por tipo ${tipo} y periodo ${periodo}: %o`, error);
    return res.status(500).json({ message: `Error al obtener los sueldos filtrados por tipo ${tipo} y periodo ${periodo}` });
  }
};
