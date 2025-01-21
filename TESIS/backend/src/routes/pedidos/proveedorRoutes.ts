import { Router } from 'express';
import { createProveedor, updateProveedor, getAllProveedores, getProveedorById, deleteProveedor } from '../../controllers/pedidos/proveedorController';
import { authMiddleware, roleMiddleware } from '../../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Rutas para proveedores
router.post('/crear-proveedor', roleMiddleware(['gerente', 'jefe_inventarista']), createProveedor);
router.put('/actualizar-proveedor/:id', roleMiddleware(['gerente', 'jefe_inventarista']), updateProveedor);
router.get('/proveedores', roleMiddleware(['gerente', 'jefe_inventarista']), getAllProveedores);
router.get('/proveedores/:id', roleMiddleware(['gerente', 'jefe_inventarista']), getProveedorById);
router.delete('/eliminar-proveedor/:id', roleMiddleware(['gerente', 'jefe_inventarista']), deleteProveedor);

export default router;
