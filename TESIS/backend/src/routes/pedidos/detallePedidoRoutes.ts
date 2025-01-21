import { Router } from 'express';
import { createDetallePedido, updateDetallePedido, getAllDetallePedidos, getDetallePedidoById, deleteDetallePedido } from '../../controllers/pedidos/detallePedidoController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para detalle de pedidos
router.post('/crear-detalle-pedido', roleMiddleware(['gerente', 'jefe_inventarista']), createDetallePedido);
router.put('/actualizar-detalle-pedido/:id', roleMiddleware(['gerente', 'jefe_inventarista']), updateDetallePedido);
router.get('/detalle-pedidos', roleMiddleware(['gerente', 'jefe_inventarista']), getAllDetallePedidos);
router.get('/detalle-pedidos/:id', roleMiddleware(['gerente', 'jefe_inventarista']), getDetallePedidoById);
router.delete('/eliminar-detalle-pedido/:id', roleMiddleware(['gerente', 'jefe_inventarista']), deleteDetallePedido);

export default router;