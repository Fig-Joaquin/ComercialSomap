import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Proveedor } from '../../entities/pedidos/proveedorEntity';
import { proveedorSchema } from '../../schemas/pedidos/proveedorSchema';
import { ZodValidatorAdapter } from '../../plugins/zod-validator-plugin';
import logger from '../../utils/logger';

const validator = new ZodValidatorAdapter(proveedorSchema);

// ---------------- Crear un proveedor ----------------
export const createProveedor = async (req: Request, res: Response) => {
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && !validationResult.success) {
    logger.error('Invalid input for createProveedor: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for proveedor', errors: validationResult.errors });
  }

  const { nombre_empresa, telefono, razon_social, direccion } = req.body; // Atributos en minúsculas

  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);
    const newProveedor = proveedorRepository.create({
      nombre_empresa,
      telefono,
      razon_social,
      direccion,
    });
    await proveedorRepository.save(newProveedor);
    logger.info('Proveedor created: %o', newProveedor);
    res.status(201).json(newProveedor);
  } catch (err) {
    logger.error('Error creating Proveedor: %o', err);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};

// ---------------- Obtener todos los proveedores ----------------
export const getAllProveedores = async (req: Request, res: Response) => {
  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);
    const proveedores = await proveedorRepository.find();
    res.status(200).json(proveedores);
  } catch (err) {
    logger.error('Error fetching proveedores: %o', err);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};

// ---------------- Obtener un proveedor por ID ----------------
export const getProveedorById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);
    const proveedor = await proveedorRepository.findOne({ where: { id_proveedor: Number(id) } }); // Atributo en minúsculas

    if (!proveedor) {
      logger.warn('Proveedor not found for id_proveedor: %s', id);
      return res.status(404).json({ message: 'Proveedor not found' });
    }

    res.status(200).json(proveedor);
  } catch (err) {
    logger.error('Error fetching Proveedor by ID: %o', err);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};

// ---------------- Actualizar un proveedor ----------------
export const updateProveedor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && !validationResult.success) {
    logger.error('Invalid input for updateProveedor: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for proveedor', errors: validationResult.errors });
  }

  const { nombre_empresa, telefono, razon_social, direccion } = req.body; // Atributos en minúsculas

  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    // Verificar si el proveedor existe
    const proveedor = await proveedorRepository.findOne({ where: { id_proveedor: Number(id) } }); // Atributo en minúsculas
    if (!proveedor) {
      logger.warn('Proveedor not found for id_proveedor: %s', id);
      return res.status(404).json({ message: 'Proveedor not found' });
    }

    // Actualizar el proveedor
    proveedor.nombre_empresa = nombre_empresa;
    proveedor.telefono = telefono;
    proveedor.razon_social = razon_social;
    proveedor.direccion = direccion;

    await proveedorRepository.save(proveedor);
    logger.info('Proveedor updated: %o', proveedor);
    res.status(200).json(proveedor);
  } catch (err) {
    logger.error('Error updating Proveedor: %o', err);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};

// ---------------- Eliminar un proveedor ----------------
export const deleteProveedor = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    // Verificar si el proveedor existe
    const proveedor = await proveedorRepository.findOne({ where: { id_proveedor: Number(id) } }); // Atributo en minúsculas
    if (!proveedor) {
      logger.warn('Proveedor not found for id_proveedor: %s', id);
      return res.status(404).json({ message: 'Proveedor not found' });
    }

    await proveedorRepository.remove(proveedor);
    logger.info('Proveedor deleted: %o', proveedor);
    res.status(200).json({ message: 'Proveedor deleted successfully' });
  } catch (err) {
    logger.error('Error deleting Proveedor: %o', err);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};
