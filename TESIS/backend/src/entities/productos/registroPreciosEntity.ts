import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Productos } from './productosEntity';

@Entity('registro_precios') // Tabla en minúsculas
export class RegistroPrecios { // Nombre de la clase ajustado a camelCase sin guiones bajos
    @PrimaryGeneratedColumn()
    id_registro: number; // Atributo en minúsculas

    @ManyToOne(() => Productos, producto => producto.registroPrecios)
    @JoinColumn({ name: 'id_producto' }) // Clave foránea en minúsculas
    id_producto: Productos;
    
    @Column({ name: 'fecha_fin', nullable: true }) // Atributo en minúsculas
    fecha_fin: Date;
    
    @Column({ name: 'fecha_creacion' }) // Atributo en minúsculas
    fecha_creacion: Date;

    @Column('decimal', { name: 'precio_neto' }) // Atributo en minúsculas
    precio_neto: number;

    @Column('decimal', { name: 'precio_venta' }) // Atributo en minúsculas
    precio_venta: number;
}
