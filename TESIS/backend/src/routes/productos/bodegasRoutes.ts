import { Router } from 'express';
import { createBodega, updateBodega, getAllBodegas, getBodegaById, deleteBodega } from '../../controllers/productos/bodegasController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para bodegas
router.post('/crear-bodega', roleMiddleware(['gerente', 'jefe_inventarista']), createBodega);
router.put('/actualizar-bodega/:id', roleMiddleware(['gerente', 'jefe_inventarista']), updateBodega);
router.get('/bodegas', roleMiddleware(['gerente', 'jefe_inventarista']), getAllBodegas);
router.get('/bodegas/:id', roleMiddleware(['gerente', 'jefe_inventarista']), getBodegaById);
router.delete('/eliminar-bodega/:id', roleMiddleware(['gerente', 'jefe_inventarista']), deleteBodega);

export default router;
