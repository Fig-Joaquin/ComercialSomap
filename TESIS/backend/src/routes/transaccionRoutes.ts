import { Router } from 'express';
import { createTransaccion, getTotales, updateTransaccion, deleteTransaccion, getTransaccionesPorAno, getTransaccionesPorMes, getTransacciones } from '../controllers/transaccionController';
import { authMiddleware, roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/transacciones', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), createTransaccion); // Checked
router.get('/transacciones-totales', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), getTotales); // Checked
router.get('/transacciones', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), getTransacciones); // Checked
router.put('/transacciones/:id', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']) , updateTransaccion); // Checked
router.delete('/transacciones/:id', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), deleteTransaccion); //Checked
router.get('/transacciones/mes/:year/:month',roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), getTransaccionesPorMes); // Checked
router.get('/transacciones/ano/:year', roleMiddleware(['gerente', 'jefe_administrativo', 'administrativo']), getTransaccionesPorAno); // Checked

export default router;
