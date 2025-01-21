import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comuna } from './comunaEntity';

@Entity('region') // Nombre de la tabla en minúsculas
export class Region {
  @PrimaryGeneratedColumn()
  id_region: number; // Nombre de columna en minúsculas

  @Column({ length: 100 })
  nombre: string; // Nombre de columna en minúsculas

  @OneToMany(() => Comuna, comuna => comuna.region)
  comunas: Comuna[]; // Relación en minúsculas
}
