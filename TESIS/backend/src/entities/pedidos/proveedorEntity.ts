import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Productos } from '../productos/productosEntity';
import { Pedidos } from './pedidosEntity';

@Entity('proveedor') // Nombre de la tabla en minúsculas
export class Proveedor {
    @PrimaryGeneratedColumn()
    id_proveedor: number; // Atributo en minúsculas y snake_case

    @Column({ name: 'nombre_empresa' }) // Atributo en minúsculas
    nombre_empresa: string;

    @Column({ name: 'telefono' }) // Atributo en minúsculas
    telefono: string;

    @Column({ name: 'razon_social' }) // Atributo en minúsculas
    razon_social: string;

    @Column({ name: 'direccion' }) // Atributo en minúsculas
    direccion: string;

    @OneToMany(() => Productos, producto => producto.id_proveedor) // Relación ajustada
    productos: Productos[];

    @OneToMany(() => Pedidos, pedido => pedido.proveedor) // Relación ajustada
    pedidos: Pedidos[];
}
