import { Router } from 'express';
import {
  createImagenProducto,
  getImagenesByProducto,
  deleteImagenProducto,
} from '../../controllers/productos/imagenProductoController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';
import { upload } from '../../middleware/uploadMiddleware'; // Middleware para subir imágenes

// Creación de la variable router.
const router = Router();

// Rutas públicas (sin autenticación)
router.get(
  '/:id/imagenes', 
  getImagenesByProducto // Obtener imágenes sin autenticación
);

// Aplicar authMiddleware solo en rutas que necesitan autenticación
router.use(authMiddleware); // Aquí solo las rutas privadas necesitan autenticación

// Rutas para manejar imágenes de productos (requiere autenticación)
router.post(
  '/subir-imagen',
  roleMiddleware(['gerente', 'jefe_inventarista']), // Middleware de roles
  upload.single('imagen'), // Middleware para manejar la carga de una imagen
  createImagenProducto // Controlador para crear la imagen
);

router.delete(
  '/eliminar-imagen/:id',
  roleMiddleware(['gerente', 'jefe_inventarista']),
  deleteImagenProducto
);

export default router;
