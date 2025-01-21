import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Productos } from './productosEntity';

@Entity('categoria') // Tabla en minúsculas
export class Categoria {
    @PrimaryGeneratedColumn()
    id_categoria: number; // Atributo en minúsculas

    @Column()
    tipo: string; // Atributo en minúsculas

    @OneToMany(() => Productos, producto => producto.id_categoria) // Relación ajustada a minúsculas
    productos: Productos[];
}
