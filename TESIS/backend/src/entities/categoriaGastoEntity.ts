import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Gasto } from './gastoEntity';

@Entity('categoria_gasto') // Nombre de la tabla en minúsculas
export class CategoriaGasto {
  @PrimaryGeneratedColumn()
  id_categoria_gasto: number; // Nombre del atributo en minúsculas

  @Column({ length: 100 })
  nombre: string; // Nombre del atributo en minúsculas

  @OneToMany(() => Gasto, gasto => gasto.categoria_gasto)
  gastos: Gasto[]; // Nombre de la relación en minúsculas
}
