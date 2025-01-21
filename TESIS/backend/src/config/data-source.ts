import { DataSource } from 'typeorm';
import { Usuario } from '../entities/usuarioEntity';
import { Persona } from '../entities/personaEntity';
import { Cliente } from '../entities/clienteEntity';
import { Region } from '../entities/regionEntity';
import { Comuna } from '../entities/comunaEntity';
import { RolUsuario } from '../entities/rolUsuarioEntity';
import { Rol } from '../entities/rolesEntity';
import { Productos } from '../entities/productos/productosEntity';
import { Bodegas } from '../entities/productos/bodegasEntity';
import { Categoria } from '../entities/productos/categoriaEntity';
import { Proveedor } from '../entities/pedidos/proveedorEntity';
import { DetallePedido } from '../entities/pedidos/detallePedidoEntity';
import { RegistroPrecios } from '../entities/productos/registroPreciosEntity';
import { Devoluciones } from '../entities/productos/devolucionesEntity';
import { Pedidos } from '../entities/pedidos/pedidosEntity';
import { Transaccion } from '../entities/transaccionEntity';
import { Sueldo } from '../entities/sueldoEntity';
import { Gasto } from '../entities/gastoEntity';
import { CategoriaGasto } from '../entities/categoriaGastoEntity';
import { ImagenProducto } from '../entities/productos/imagenProductoEntity';
import { MovimientosStock } from '../entities/productos/movimientoStockEntity';
import { UnidadMedida } from '../entities/productos/unidadMedidaEntity';
import { Descuentos } from '../entities/productos/descuentoProductoEntity';

import dotenv from 'dotenv';

dotenv.config();


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'default_username',
  password: process.env.DB_PASSWORD ?? 'default_password',
  database: process.env.DB_DATABASE ?? 'default_database',
  entities: [Usuario, Persona, Cliente, Region, Comuna, RolUsuario, 
    Rol, Productos, Bodegas, Categoria, Proveedor, DetallePedido, 
    RegistroPrecios, Devoluciones, Pedidos,  Transaccion, Sueldo, Gasto,
    CategoriaGasto, ImagenProducto, MovimientosStock, UnidadMedida, Descuentos],
  synchronize: true,
  logging: false,
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
