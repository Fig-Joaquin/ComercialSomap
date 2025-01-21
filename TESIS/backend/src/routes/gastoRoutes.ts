import { Router } from 'express';
import { createCategoriaGasto, getAllCategoriasGasto, deleteCategoriaGasto, updateCategoriaGasto} from '../controllers/categoriaGastoController';
import { createGastoConTransaccion, updateGasto, deleteGasto, getAllGastos } from '../controllers/gastoController';
import { authMiddleware, roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

//* Categoria-Gastos
router.post('/crear-categoria-gasto', authMiddleware, roleMiddleware(['gerente','jefe_administrativo']), createCategoriaGasto);
router.get('/categorias-gasto', authMiddleware,roleMiddleware(['gerente', 'jefe_administrativo','administrativo']), getAllCategoriasGasto);
router.delete('/categorias-gasto/:id', authMiddleware, roleMiddleware(['gerente']), deleteCategoriaGasto);
router.put('/categorias-gasto/:id', authMiddleware, roleMiddleware(['gerente','jefe_administrativo']), updateCategoriaGasto);
//* Gastos
router.post('/crear-gasto', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo','administrativo']), createGastoConTransaccion);
router.get('/gastos', authMiddleware, roleMiddleware(['gerente', 'jefe_administrativo','administrativo']), getAllGastos);
router.put('/gastos/:id', authMiddleware,  roleMiddleware(['gerente', 'jefe_administrativo','administrativo']), updateGasto);
router.delete('/gastos/:id', authMiddleware, roleMiddleware(['gerente']), deleteGasto);

export default router;
