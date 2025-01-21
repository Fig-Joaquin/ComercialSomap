import { Router } from 'express';
import personaRoutes from './personaRoutes';
import usuarioRoutes from './usuarioRoutes';
import clienteRoutes from './clienteRoutes';
import comunaRoutes from './comunaRoutes';
import regionRoutes from './regionRoutes';
import roles from './rolesRoutes';
import rolUsuario from './rolUsuarioRoutes';
import detallePedidoRoutes from './pedidos/detallePedidoRoutes';
import pedidosRoutes from './pedidos/pedidosRoutes';
import proveedorRoutes from './pedidos/proveedorRoutes';
import bodegasRoutes from './productos/bodegasRoutes';
import categoriaRoutes from './productos/categoriaRoutes';
import devolucionesRoutes from './productos/devolucionesRoutes';
import productosRoutes from './productos/productosRoutes';
import registroPreciosRoutes from './productos/registroPreciosRoutes';
import transaccion from './transaccionRoutes';
import sueldo from './sueldoRoutes';
import gasto from './gastoRoutes';
import imagenProductoRoutes from './productos/imagenProductoRoutes';
import movimientoStockRoutes from './productos/movimientoStockRoutes';
import { authMiddleware } from '../middleware/authMiddleware';

const privateRoutes = Router();

// Aplicar el middleware de autenticación
privateRoutes.use(authMiddleware);

// Agrupamos todas las rutas privadas
privateRoutes.use('/persona', personaRoutes);
privateRoutes.use('/usuario', usuarioRoutes);
privateRoutes.use('/cliente', clienteRoutes);
privateRoutes.use('/comuna', comunaRoutes);
privateRoutes.use('/region', regionRoutes);
privateRoutes.use('/roles', roles);
privateRoutes.use('/rol-usuario', rolUsuario);
privateRoutes.use('/detalle-pedido', detallePedidoRoutes);
privateRoutes.use('/pedidos', pedidosRoutes);
privateRoutes.use('/proveedor', proveedorRoutes);
privateRoutes.use('/bodegas', bodegasRoutes);
privateRoutes.use('/categorias', categoriaRoutes);
privateRoutes.use('/devoluciones', devolucionesRoutes);
privateRoutes.use('/productos', productosRoutes);
privateRoutes.use('/registro-precios', registroPreciosRoutes);
privateRoutes.use('/transaccion', transaccion);
privateRoutes.use('/sueldo', sueldo);
privateRoutes.use('/gasto', gasto);
privateRoutes.use('/imagenes', imagenProductoRoutes);
privateRoutes.use('/movimiento-stock', movimientoStockRoutes);

export default privateRoutes;
