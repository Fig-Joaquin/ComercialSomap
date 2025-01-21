import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Productos } from './productosEntity';

@Entity('devoluciones') // Tabla en minúsculas
export class Devoluciones {
    @PrimaryGeneratedColumn()
    id_devolucion: number; // Atributo en minúsculas para la base de datos

    @ManyToOne(() => Productos, producto => producto.devoluciones)
    @JoinColumn({ name: 'id_producto' }) // Clave foránea en minúsculas
    id_producto: Productos; // Relación en minúsculas

    @Column('decimal')
    cantidad_unidades: number; // Atributo en minúsculas

    @Column('decimal')
    cantidad_cajas: number; // Atributo en minúsculas

    @Column()
    fecha_devolucion: Date; // Atributo en minúsculas

    @Column()
    razon: string; // Atributo en minúsculas
}
