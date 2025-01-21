import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { ImagenProducto } from '../../entities/productos/imagenProductoEntity';
import { Productos } from '../../entities/productos/productosEntity';
import logger from '../../utils/logger';
import { imagenProductoSchema } from '../../schemas/productos/imagenProductoSchema';

// Crear una imagen asociada a un producto
export const createImagenProducto = async (req: Request, res: Response) => {
  try {
    // Convertir id_producto a número
    const id_producto = Number(req.body.id_producto);

    // Construir los datos a validar
    const validationData = {
      id_producto,
      url: req.file ? `/uploads/imagenes/${req.file.filename}` : '',
    };

    // Validar los datos con Zod
    const validationResult = imagenProductoSchema.safeParse(validationData);

    if (!validationResult.success) {
      logger.error('Datos inválidos para la imagen: %o', validationResult.error.errors);
      return res.status(400).json({ message: 'Datos inválidos', errors: validationResult.error.errors });
    }

    // Verificar si el producto existe
    const productoRepository = AppDataSource.getRepository(Productos);
    const producto = await productoRepository.findOne({ where: { id_producto } });

    if (!producto) {
      logger.warn('Producto no encontrado: %d', id_producto);
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Guardar la imagen en la base de datos
    const imagenProductoRepository = AppDataSource.getRepository(ImagenProducto);
    const newImagen = imagenProductoRepository.create({
      url: validationResult.data.url, // Ruta de la imagen validada
      producto,
    });

    await imagenProductoRepository.save(newImagen);

    logger.info('Imagen subida exitosamente: %o', newImagen);
    res.status(201).json({ message: 'Imagen subida exitosamente', imagen: newImagen });
  } catch (err) {
    logger.error('Error creando ImagenProducto: %o', err);

    if (err instanceof Error) {
      return res.status(500).json({ message: 'Error al subir la imagen', error: err.message });
    }

    res.status(500).json({ message: 'Ocurrió un error desconocido' });
  }
};



// Obtener imágenes de un producto
export const getImagenesByProducto = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const imagenProductoRepository = AppDataSource.getRepository(ImagenProducto);
    const imagenes = await imagenProductoRepository.find({ where: { producto: { id_producto: Number(id) } } });

    if (imagenes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron imágenes para este producto' });
    }

    // Construir la URL correctamente
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const imagenesConUrl = imagenes.map((img) => ({
      ...img,
      url: `${baseUrl}${img.url.startsWith('/') ? img.url : `/${img.url}`}`, // Evita duplicar rutas
    }));

    res.status(200).json(imagenesConUrl);
  } catch (err) {
    console.error('Error obteniendo imágenes:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar una imagen
export const deleteImagenProducto = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const imagenProductoRepository = AppDataSource.getRepository(ImagenProducto);
    const imagen = await imagenProductoRepository.findOne({ where: { id_imagen: Number(id) } });

    if (!imagen) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    await imagenProductoRepository.remove(imagen);

    res.status(200).json({ message: 'Imagen eliminada exitosamente' });
  } catch (err) {
    logger.error('Error eliminando ImagenProducto: %o', err);

    if (err instanceof Error) {
      return res.status(500).json({ message: 'Error al eliminar la imagen', error: err.message });
    }

    res.status(500).json({ message: 'Ocurrió un error desconocido' });
  }
};
