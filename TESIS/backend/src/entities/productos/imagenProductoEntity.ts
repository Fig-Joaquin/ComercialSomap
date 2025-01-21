import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Productos } from './productosEntity';

@Entity('imagen_producto') // Tabla en minúsculas
export class ImagenProducto {
    @PrimaryGeneratedColumn()
    id_imagen: number; // Atributo en minúsculas

    @Column({ name: 'url' }) // Atributo en minúsculas
    url: string;

    @ManyToOne(() => Productos, producto => producto.imagenes)
    @JoinColumn({ name: 'id_producto' }) // Clave foránea en minúsculas
    producto: Productos;
}
