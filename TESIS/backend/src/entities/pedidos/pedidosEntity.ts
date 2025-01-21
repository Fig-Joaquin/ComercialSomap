import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Proveedor } from './proveedorEntity';
import { Cliente } from '../clienteEntity';
import { DetallePedido } from './detallePedidoEntity'; // Nombre actualizado

@Entity('pedidos') // Tabla en minúsculas
export class Pedidos {
    @PrimaryGeneratedColumn()
    id_pedido: number; // Atributo en minúsculas y snake_case

    @ManyToOne(() => Cliente, cliente => cliente.pedidos)
    @JoinColumn({ name: 'id_cliente' }) // Clave foránea en minúsculas
    cliente: Cliente; // Propiedad en camelCase

    @ManyToOne(() => Proveedor, proveedor => proveedor.pedidos)
    @JoinColumn({ name: 'id_proveedor' }) // Clave foránea en minúsculas
    proveedor: Proveedor; // Propiedad en camelCase

    @Column({ name: 'tipo_pedido', length: 50 }) // Atributo en minúsculas
    tipo_pedido: string;

    @Column({ name: 'fecha_pedido' }) // Atributo en minúsculas
    fecha_pedido: Date;

    @Column({ name: 'fecha_entrega' }) // Atributo en minúsculas
    fecha_entrega: Date;

    @Column({ name: 'comentarios', length: 255 }) // Atributo en minúsculas
    comentarios: string;

    @Column({ name: 'estado', length: 50 }) // Atributo en minúsculas
    estado: string;

    @OneToMany(() => DetallePedido, detalle => detalle.id_pedido)
    detalles: DetallePedido[]; // Relación ajustada con minúsculas
}
