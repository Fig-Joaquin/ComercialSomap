import { Router } from 'express';
import { createCategoria, updateCategoria, getAllCategorias, getCategoriaById, deleteCategoria } from '../../controllers/productos/categoriaController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para categorías
router.post('/crear-categoria', roleMiddleware(['gerente', 'jefe_inventarista']), createCategoria);
router.put('/actualizar-categoria/:id', roleMiddleware(['gerente', 'jefe_inventarista']), updateCategoria);
router.get('/categorias', roleMiddleware(['gerente', 'jefe_inventarista']), getAllCategorias);
router.get('/categorias/:id', roleMiddleware(['gerente', 'jefe_inventarista']), getCategoriaById);
router.delete('/eliminar-categoria/:id', roleMiddleware(['gerente', 'jefe_inventarista']), deleteCategoria);

export default router;
