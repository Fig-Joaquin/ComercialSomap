import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Categoria } from '../../entities/productos/categoriaEntity';
import { categoriaSchema } from '../../schemas/productos/categoriaSchema';
import { ZodValidatorAdapter } from '../../plugins/zod-validator-plugin';
import logger from '../../utils/logger';

// Instancia del adaptador de validación
const validator = new ZodValidatorAdapter(categoriaSchema);

// ---------------- Crear una categoria ----------------
export const createCategoria = async (req: Request, res: Response) => {
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for createCategoria: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for categoria', errors: validationResult.errors });
  }

  const { tipo } = req.body; // Cambio de "Tipo" a "tipo"

  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const newCategoria = categoriaRepository.create({ tipo });
    await categoriaRepository.save(newCategoria);
    logger.info('Categoria created: %o', newCategoria);
    res.status(201).json(newCategoria);
  } catch (err) {
    logger.error('Error creating categoria: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener todas las categorias ----------------
export const getAllCategorias = async (req: Request, res: Response) => {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const categorias = await categoriaRepository.find();
    res.status(200).json(categorias);
  } catch (err) {
    logger.error('Error fetching categorias: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Obtener una categoria por ID ----------------
export const getCategoriaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const categoria = await categoriaRepository.findOne({ where: { id_categoria: Number(id) } }); // Cambio de "ID_Categoria" a "id_categoria"

    if (!categoria) {
      logger.warn('Categoria not found for id_categoria: %s', id);
      return res.status(404).json({ message: 'Categoria not found' });
    }

    res.status(200).json(categoria);
  } catch (err) {
    logger.error('Error fetching categoria by ID: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Actualizar una categoria ----------------
export const updateCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validationResult = validator.validateAndSanitize(req.body);
  if (validationResult && validationResult.errors) {
    logger.error('Invalid input for updateCategoria: %o', validationResult.errors);
    return res.status(400).json({ message: 'Invalid input for categoria', errors: validationResult.errors });
  }

  const { tipo } = req.body; // Cambio de "Tipo" a "tipo"

  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);

    // Verificar si la categoria existe
    const categoria = await categoriaRepository.findOne({ where: { id_categoria: Number(id) } }); // Cambio de "ID_Categoria" a "id_categoria"
    if (!categoria) {
      logger.warn('Categoria not found for id_categoria: %s', id);
      return res.status(404).json({ message: 'Categoria not found' });
    }

    // Actualizar la categoria
    categoria.tipo = tipo;

    await categoriaRepository.save(categoria);
    logger.info('Categoria updated: %o', categoria);
    res.status(200).json(categoria);
  } catch (err) {
    logger.error('Error updating categoria: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// ---------------- Eliminar una categoria ----------------
export const deleteCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;

  const categoriaId = Number(id);
  if (isNaN(categoriaId)) {
    logger.warn('Invalid ID format: %s', id);
    return res.status(400).json({ message: 'Formato de ID inválido' });
  }

  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);

    // Verificar si la categoría tiene productos asociados
    const categoria = await categoriaRepository.findOne({
      where: { id_categoria: categoriaId },
      relations: ['productos'],
    });

    if (!categoria) {
      logger.warn('Categoria not found for id_categoria: %s', id);
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    if (categoria.productos.length > 0) {
      logger.warn('Cannot delete categoria with associated products: %s', id);
      return res.status(400).json({
        message: 'No se puede eliminar la categoría porque tiene productos asociados',
      });
    }

    await categoriaRepository.remove(categoria);
    logger.info('Categoria deleted: %o', categoria);
    res.status(200).json({ message: 'Categoría eliminada exitosamente' });
  } catch (err) {
    logger.error('Error deleting categoria: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: 'Error interno al eliminar la categoría', error: err.message });
    } else {
      res.status(500).json({ message: 'Ocurrió un error desconocido' });
    }
  }
};
