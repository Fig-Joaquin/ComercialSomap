import { Router } from 'express';
import { createRegistroPrecios, updateRegistroPrecios, getAllRegistroPrecios, getRegistroPreciosById, deleteRegistroPrecios } from '../../controllers/productos/registroPreciosController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para registro de precios
router.post('/crear-registro-precio', roleMiddleware(['gerente', 'jefe_inventarista']), createRegistroPrecios);
router.put('/actualizar-registro-precio/:id', roleMiddleware(['gerente', 'jefe_inventarista']), updateRegistroPrecios);
router.get('/registro-precios', roleMiddleware(['gerente', 'jefe_inventarista']), getAllRegistroPrecios);
router.get('/registro-precios/:id', roleMiddleware(['gerente', 'jefe_inventarista']), getRegistroPreciosById);
router.delete('/eliminar-registro-precio/:id', roleMiddleware(['gerente', 'jefe_inventarista']), deleteRegistroPrecios);

export default router;
