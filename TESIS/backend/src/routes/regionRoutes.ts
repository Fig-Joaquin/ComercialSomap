import {Router} from 'express';
import {createRegion, getAllRegiones} from '../controllers/regionController';
import { authMiddleware, roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// ! Eliminar JEFE ADMINISTRATIVO
router.post('/crear-region', roleMiddleware(['gerente', 'jefe_administrativo']), createRegion); // NO CHECKED
router.get('/mostrar-regiones', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), getAllRegiones); // CHECKED
export default router;
