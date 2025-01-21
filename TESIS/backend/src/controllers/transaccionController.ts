import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Transaccion, TipoTransaccion } from '../entities/transaccionEntity';
import { ZodValidatorAdapter } from '../plugins/zod-validator-plugin';
import { transaccionSchemaRegistro, transaccionSchemaActualizacion} from '../schemas/transaccionSchema';
import logger from '../utils/logger';

const transaccionRepository = AppDataSource.getRepository(Transaccion);

// Función para crear transacciones (ya existente)
export const createTransaccion = async (req: Request, res: Response): Promise<Response> => {
  const adapter = new ZodValidatorAdapter(transaccionSchemaRegistro);
  const validationResult = adapter.validateAndSanitize(req.body);

  if (validationResult.errors) {
    logger.error('Invalid input for createTransaccion: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
  }

  // Transformar la fecha de dd-mm-yyyy a yyyy-mm-dd
  const [day, month, year] = validationResult.data.Fecha.split('-');
  const formattedDate = `${year}-${month}-${day}`;

  try {
    const nuevaTransaccion = transaccionRepository.create({
      ...validationResult.data,
      Fecha: formattedDate,
    });
    await transaccionRepository.save(nuevaTransaccion);
    logger.info('Transacción creada: %o', nuevaTransaccion);
    return res.status(201).json(nuevaTransaccion);
  } catch (error) {
    logger.error('Error al crear la transacción: %o', error);
    return res.status(500).json({ message: 'Error al crear la transacción' });
  }
};

// Función para obtener totales (ya existente)
export const getTotales = async (req: Request, res: Response): Promise<Response> => {
  try {
    const ingresos = await transaccionRepository
      .createQueryBuilder('transaccion')
      .select('SUM(transaccion.Monto)', 'total')
      .where('transaccion.Tipo = :tipo', { tipo: TipoTransaccion.INGRESO })
      .getRawOne();

    const egresos = await transaccionRepository
      .createQueryBuilder('transaccion')
      .select('SUM(transaccion.Monto)', 'total')
      .where('transaccion.Tipo = :tipo', { tipo: TipoTransaccion.EGRESO })
      .getRawOne();

    const totalIngresos = parseFloat(ingresos?.total) || 0;
    const totalEgresos = parseFloat(egresos?.total) || 0;
    const diferencia = totalIngresos - totalEgresos;

    return res.status(200).json({
      totalIngresos,
      totalEgresos,
      diferencia,
    });
  } catch (error) {
    logger.error('Error al calcular los totales: %o', error);
    return res.status(500).json({ message: 'Error al calcular los totales' });
  }
};

// Función para actualizar una transacción (ya existente)
export const updateTransaccion = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const adapter = new ZodValidatorAdapter(transaccionSchemaActualizacion)  ;
    const validationResult = adapter.validateAndSanitize(req.body);
  
    if (validationResult.errors) {
      logger.error('Invalid input for updateTransaccion: %o', validationResult.errors);
      return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
    }
  
    try {
      const transaccion = await transaccionRepository.findOneBy({ id_transaccion: parseInt(id) });
      if (!transaccion) {
        logger.warn('Transacción no encontrada: %s', id);
        return res.status(404).json({ message: 'Transacción no encontrada' });
      }
  
      // Actualizar los campos permitidos
      if (validationResult.data.Fecha) {
        const [day, month, year] = validationResult.data.Fecha.split('-');
        transaccion.fecha = new Date(`${year}-${month}-${day}`);
      }
      if (validationResult.data.Tipo) transaccion.tipo = validationResult.data.Tipo;
      if (validationResult.data.Monto !== undefined) transaccion.monto = validationResult.data.Monto;
      if (validationResult.data.Descripcion !== undefined) transaccion.descripcion = validationResult.data.Descripcion;
  
      await transaccionRepository.save(transaccion);
      logger.info('Transacción actualizada: %o', transaccion);
      return res.status(200).json(transaccion);
    } catch (error) {
      logger.error('Error al actualizar la transacción: %o', error);
      return res.status(500).json({ message: 'Error al actualizar la transacción' });
    }
  };

// Función para eliminar una transacción (ya existente)
export const deleteTransaccion = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const transaccion = await transaccionRepository.findOneBy({ id_transaccion: parseInt(id) });
    if (!transaccion) {
      logger.warn('Transacción no encontrada: %s', id);
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    await transaccionRepository.remove(transaccion);
    logger.info('Transacción eliminada: %o', transaccion);
    return res.status(200).json({ message: 'Transacción eliminada correctamente' });
  } catch (error) {
    logger.error('Error al eliminar la transacción: %o', error);
    return res.status(500).json({ message: 'Error al eliminar la transacción' });
  }
};

// Función para obtener ingresos y egresos por mes
export const getTransaccionesPorMes = async (req: Request, res: Response): Promise<Response> => {
  const { year, month } = req.params;

  try {
    const ingresos = await transaccionRepository
      .createQueryBuilder('transaccion')
      .select('SUM(transaccion.Monto)', 'total')
      .where('transaccion.Tipo = :tipo AND EXTRACT(YEAR FROM transaccion.Fecha) = :year AND EXTRACT(MONTH FROM transaccion.Fecha) = :month', { 
        tipo: TipoTransaccion.INGRESO,
        year: parseInt(year),
        month: parseInt(month)
      })
      .getRawOne();

    const egresos = await transaccionRepository
      .createQueryBuilder('transaccion')
      .select('SUM(transaccion.Monto)', 'total')
      .where('transaccion.Tipo = :tipo AND EXTRACT(YEAR FROM transaccion.Fecha) = :year AND EXTRACT(MONTH FROM transaccion.Fecha) = :month', { 
        tipo: TipoTransaccion.EGRESO,
        year: parseInt(year),
        month: parseInt(month)
      })
      .getRawOne();

    const totalIngresos = parseFloat(ingresos?.total) || 0;
    const totalEgresos = parseFloat(egresos?.total) || 0;
    const diferencia = totalIngresos - totalEgresos;

    return res.status(200).json({
      totalIngresos,
      totalEgresos,
      diferencia,
    });
  } catch (error) {
    logger.error('Error al obtener las transacciones por mes: %o', error);
    return res.status(500).json({ message: 'Error al obtener las transacciones por mes' });
  }
};

// Función para obtener ingresos y egresos por año
export const getTransaccionesPorAno = async (req: Request, res: Response): Promise<Response> => {
  const { year } = req.params;

  try {
    const ingresos = await transaccionRepository
      .createQueryBuilder('transaccion')
      .select('SUM(transaccion.Monto)', 'total')
      .where('transaccion.Tipo = :tipo AND EXTRACT(YEAR FROM transaccion.Fecha) = :year', { 
        tipo: TipoTransaccion.INGRESO,
        year: parseInt(year)
      })
      .getRawOne();

    const egresos = await transaccionRepository
      .createQueryBuilder('transaccion')
      .select('SUM(transaccion.Monto)', 'total')
      .where('transaccion.Tipo = :tipo AND EXTRACT(YEAR FROM transaccion.Fecha) = :year', { 
        tipo: TipoTransaccion.EGRESO,
        year: parseInt(year)
      })
      .getRawOne();

    const totalIngresos = parseFloat(ingresos?.total) || 0;
    const totalEgresos = parseFloat(egresos?.total) || 0;
    const diferencia = totalIngresos - totalEgresos;

    return res.status(200).json({
      totalIngresos,
      totalEgresos,
      diferencia,
    });
  } catch (error) {
    logger.error('Error al obtener las transacciones por año: %o', error);
    return res.status(500).json({ message: 'Error al obtener las transacciones por año' });
  }
};

export const getTransacciones = async (req: Request, res: Response): Promise<Response> => {
    try {
      const transacciones = await transaccionRepository.find();
      return res.status(200).json(transacciones);
    } catch (error) {
      logger.error('Error al obtener las transacciones: %o', error);
      return res.status(500).json({ message: 'Error al obtener las transacciones' });
    }
  };