import { Router } from 'express';
import { createSueldo, updateSueldo, deleteSueldo, getAllSueldos, getSueldosByTipo } from '../controllers/sueldoController';
import { authMiddleware, roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware)

router.post('/sueldos', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), createSueldo);
router.put('/sueldos/:id',  roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), updateSueldo);
router.delete('/sueldos/:id' , roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), deleteSueldo);
router.get('/sueldos', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), getAllSueldos);
router.get('/categoria-sueldo', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), getSueldosByTipo); 

export default router;
