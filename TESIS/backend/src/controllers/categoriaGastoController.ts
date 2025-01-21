import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { CategoriaGasto } from '../entities/categoriaGastoEntity';
import { ZodValidatorAdapter } from '../plugins/zod-validator-plugin';
import { categoriaGastoSchema } from '../schemas/categoriaGastoSchema';
import logger from '../utils/logger';

// Crear una categoría de gasto
export const createCategoriaGasto = async (req: Request, res: Response) => {
    const adapter = new ZodValidatorAdapter(categoriaGastoSchema);
    const validationResult = adapter.validateAndSanitize(req.body);

    if (validationResult.errors) {
        logger.error('Invalid input for createCategoriaGasto: %o', validationResult.errors);
        return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
    }

    try {
        const categoriaGastoRepository = AppDataSource.getRepository(CategoriaGasto);
        const newCategoriaGasto = categoriaGastoRepository.create(validationResult.data);
        await categoriaGastoRepository.save(newCategoriaGasto);
        logger.info('Categoría de gasto creada: %o', newCategoriaGasto);
        res.status(201).json(newCategoriaGasto);
    } catch (err) {
        logger.error('Error creating categoria_gasto: %o', err);
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

// Obtener todas las categorías de gasto
export const getAllCategoriasGasto = async (req: Request, res: Response) => {
    try {
        const categoriaGastoRepository = AppDataSource.getRepository(CategoriaGasto);
        const categoriasGasto = await categoriaGastoRepository.find();
        res.status(200).json(categoriasGasto);
    } catch (err) {
        logger.error('Error fetching categorias_gasto: %o', err);
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

// Actualizar una categoría de gasto
export const updateCategoriaGasto = async (req: Request, res: Response) => {
    const { id } = req.params;

    const adapter = new ZodValidatorAdapter(categoriaGastoSchema);
    const validationResult = adapter.validateAndSanitize(req.body);

    if (validationResult.errors) {
        logger.error('Invalid input for updateCategoriaGasto: %o', validationResult.errors);
        return res.status(400).json({ message: 'Invalid input', errors: validationResult.errors });
    }

    try {
        const categoriaGastoRepository = AppDataSource.getRepository(CategoriaGasto);

        const categoriaGasto = await categoriaGastoRepository.findOne({ where: { id_categoria_gasto: Number(id) } });

        if (!categoriaGasto) {
            return res.status(404).json({ message: 'Categoría de gasto no encontrada' });
        }

        categoriaGasto.nombre = validationResult.data.nombre;

        await categoriaGastoRepository.save(categoriaGasto);

        logger.info('Categoría de gasto actualizada: %o', categoriaGasto);
        return res.status(200).json(categoriaGasto);
    } catch (err) {
        logger.error('Error updating categoria_gasto: %o', err);
        if (err instanceof Error) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

// Eliminar una categoría de gasto
export const deleteCategoriaGasto = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const categoriaGastoRepository = AppDataSource.getRepository(CategoriaGasto);

        const categoriaGasto = await categoriaGastoRepository.findOne({ where: { id_categoria_gasto: Number(id) } });

        if (!categoriaGasto) {
            return res.status(404).json({ message: 'Categoría de gasto no encontrada' });
        }

        await categoriaGastoRepository.remove(categoriaGasto);

        logger.info('Categoría de gasto eliminada: %o', categoriaGasto);
        return res.status(200).json({ message: 'Categoría de gasto eliminada exitosamente' });
    } catch (err) {
        logger.error('Error deleting categoria_gasto: %o', err);
        if (err instanceof Error) {
            return res.status(500).json({ message: err.message });
        } else {
            return res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
