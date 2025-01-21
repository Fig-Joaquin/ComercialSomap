import { Router } from 'express';
import { createDevolucion, updateDevolucion, getAllDevoluciones, getDevolucionById, deleteDevolucion } from '../../controllers/productos/devolucionesController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para devoluciones
router.post('/crear-devolucion', roleMiddleware(['gerente', 'jefe_inventarista']), createDevolucion);
router.put('/actualizar-devolucion/:id', roleMiddleware(['gerente', 'jefe_inventarista']), updateDevolucion);
router.get('/devoluciones', roleMiddleware(['gerente', 'jefe_inventarista']), getAllDevoluciones);
router.get('/devoluciones/:id', roleMiddleware(['gerente', 'jefe_inventarista']), getDevolucionById);
router.delete('/eliminar-devolucion/:id', roleMiddleware(['gerente', 'jefe_inventarista']), deleteDevolucion);

export default router;
