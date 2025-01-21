import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Region } from './regionEntity';
import { Cliente } from './clienteEntity';

@Entity('comuna') // Tabla en minúsculas
export class Comuna {
  @PrimaryGeneratedColumn()
  id_comuna: number; // Nombre del atributo en minúsculas

  @Column({ length: 100 })
  nombre: string; // Nombre del atributo en minúsculas

  @ManyToOne(() => Region, region => region.comunas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_region' }) // Clave foránea en minúsculas
  region: Region;

  @OneToMany(() => Cliente, cliente => cliente.comuna)
  clientes: Cliente[]; // Relación en minúsculas
}
