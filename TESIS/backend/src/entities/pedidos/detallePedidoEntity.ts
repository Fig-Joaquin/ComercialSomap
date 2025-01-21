import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedidos } from './pedidosEntity';
import { Productos } from '../productos/productosEntity';

@Entity('detalle_pedido') // Tabla en minúsculas
export class DetallePedido { // Clase en PascalCase como convención
    @PrimaryGeneratedColumn()
    id_detalle: number; // Nombre de columna en snake_case y minúsculas

    @ManyToOne(() => Pedidos, pedido => pedido.detalles)
    @JoinColumn({ name: 'id_pedido' }) // Clave foránea en minúsculas
    id_pedido: Pedidos;

    @ManyToOne(() => Productos, producto => producto.detallePedido)
    @JoinColumn({ name: 'id_producto' }) // Clave foránea en minúsculas
    id_producto: Productos;

    @Column({ name: 'cantidad' }) // Atributo en minúsculas
    cantidad: number;

    @Column({ name: 'precio_total' }) // Atributo en minúsculas
    precio_total: number;

    @Column({ name: 'descuento' }) // Atributo en minúsculas
    descuento: number;
}
