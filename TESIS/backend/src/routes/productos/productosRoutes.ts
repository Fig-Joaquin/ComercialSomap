import { Router } from 'express';
import { createProducto, updateProducto, getAllProductos, getProductoById, deleteProducto } from '../../controllers/productos/productosController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

// Rutas públicas (sin autenticación)
router.get('/', getAllProductos); // Ver todos los productos
router.get('/:id', getProductoById); // Ver producto por ID

// Rutas privadas (requieren autenticación y roles)
router.use(authMiddleware); // Middleware de autenticación

router.post('/crear', roleMiddleware(['gerente', 'jefe_inventarista']), createProducto); // Crear producto
router.put('/actualizar/:id', roleMiddleware(['gerente', 'jefe_inventarista']), updateProducto); // Actualizar producto
router.delete('/eliminar/:id', roleMiddleware(['gerente', 'jefe_inventarista']), deleteProducto); // Eliminar producto

export default router;
