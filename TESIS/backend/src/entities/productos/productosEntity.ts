import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Bodegas } from './bodegasEntity';
import { Categoria } from './categoriaEntity';
import { Proveedor } from '../pedidos/proveedorEntity';
import { DetallePedido } from '../pedidos/detallePedidoEntity';
import { RegistroPrecios } from './registroPreciosEntity';
import { Devoluciones } from './devolucionesEntity';
import { ImagenProducto } from './imagenProductoEntity';
import { MovimientosStock } from './movimientoStockEntity';
import { UnidadMedida } from './unidadMedidaEntity';
import { Descuentos } from './descuentoProductoEntity';

@Entity('productos') // Tabla en minúsculas
export class Productos {
    @PrimaryGeneratedColumn()
    id_producto: number; // Atributo en minúsculas

    @OneToMany(() => ImagenProducto, imagen => imagen.producto)
    imagenes: ImagenProducto[];

    @OneToMany(() => MovimientosStock, movimiento => movimiento.producto)
    movimientosStock: MovimientosStock[];    

    @ManyToOne(() => UnidadMedida, unidad => unidad.productos)
    @JoinColumn({ name: 'id_unidad_medida' }) // FK en minúsculas
    unidad_medida: UnidadMedida;

    @OneToMany(() => Descuentos, descuento => descuento.producto)
    descuentos: Descuentos[];

    @ManyToOne(() => Proveedor, proveedor => proveedor.productos)
    @JoinColumn({ name: 'id_proveedor' }) // FK en minúsculas
    id_proveedor: Proveedor;

    @ManyToOne(() => Categoria, categoria => categoria.productos)
    @JoinColumn({ name: 'id_categoria' }) // FK en minúsculas
    id_categoria: Categoria;

    @ManyToOne(() => Bodegas, bodegas => bodegas.productos)
    @JoinColumn({ name: 'id_bodega' }) // FK en minúsculas
    id_bodega: Bodegas;

    @Column({ name: 'nombre' }) // Atributo en minúsculas
    nombre: string;

    @Column({ name: 'descripcion' }) // Atributo en minúsculas
    descripcion: string;

    @Column('decimal', { name: 'precio_neto' }) // Atributo en minúsculas
    precio_neto: number;

    @Column('decimal', { name: 'precio_venta' }) // Atributo en minúsculas
    precio_venta: number;

    @Column('decimal', { name: 'stock_unidades' }) // Atributo en minúsculas
    stock_unidades: number;

    @Column({ name: 'unidades_por_caja' }) // Atributo en minúsculas
    unidades_por_caja: number;

    @Column({ name: 'sku' }) // Atributo en minúsculas
    sku: string;

    @OneToMany(() => DetallePedido, detallePedido => detallePedido.id_producto)
    detallePedido: DetallePedido[];

    @OneToMany(() => RegistroPrecios, registroPrecios => registroPrecios.id_producto)
    registroPrecios: RegistroPrecios[];

    @OneToMany(() => Devoluciones, devoluciones => devoluciones.id_producto)
    devoluciones: Devoluciones[];
}
