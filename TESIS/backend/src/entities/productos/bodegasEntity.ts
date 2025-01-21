import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Productos } from './productosEntity';

@Entity('bodegas') // Nombre de la tabla en minúsculas
export class Bodegas {
    @PrimaryGeneratedColumn()
    id_bodega: number; // Atributo en minúsculas

    @Column()
    nombre: string; // Atributo en minúsculas

    @Column({ name: 'direccion' }) // Atributo ajustado en minúsculas
    direccion: string;

    @OneToMany(() => Productos, producto => producto.id_bodega) // Relación ajustada
    productos: Productos[];
}
