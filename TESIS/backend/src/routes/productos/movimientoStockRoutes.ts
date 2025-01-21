import express from 'express';
import { createMovimiento, getMovimientosByProducto, getStockActual } from '../../controllers/productos/movimientoStockController';

const router = express.Router();

router.post('/', createMovimiento); // Registrar un movimiento
router.get('/:id_producto/stock', getStockActual); // Consultar el stock actual
router.get('/:id_producto', getMovimientosByProducto); // Listar movimientos

export default router;
