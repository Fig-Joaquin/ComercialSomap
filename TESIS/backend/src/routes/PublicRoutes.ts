import { Router } from 'express';
import authRoutes from './authRoutes'; // Asegúrate de que authRoutes sea una ruta válida
import productosRoutes from './productos/productosRoutes'; // Asegúrate de que productosRoutes sea el archivo correcto
import imagenRoutes from './productos/imagenProductoRoutes';

const publicRoutes = Router();

// Aquí solo deben ir las rutas públicas
publicRoutes.use('/auth', authRoutes);

// Incluye las rutas públicas de productos
publicRoutes.use('/productos', productosRoutes);

// Imagenes (accesibles sin autenticación)
publicRoutes.use('/producto', imagenRoutes);

export default publicRoutes;
