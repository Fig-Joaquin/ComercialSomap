import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Productos } from './productosEntity';

@Entity('unidad_medida') // Nombre de la tabla en minúsculas
export class UnidadMedida {
  @PrimaryGeneratedColumn()
  id_unidad: number;

  @Column({ name: 'nombre', unique: true }) // Ejemplo: "Unidades", "Kilogramos", etc.
  nombre: string;

  @OneToMany(() => Productos, producto => producto.unidad_medida)
  productos: Productos[];
}
