import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Transaccion } from './transaccionEntity';

export enum TipoSueldo {
  SEMANAL = 'semanal',
  MENSUAL = 'mensual',
  QUINCENA = 'quincena',
}

@Entity('sueldos')
export class Sueldo {
  @PrimaryGeneratedColumn({ name: 'id_sueldo' }) // Nombre en minúsculas
  id_sueldo: number;

  @ManyToOne(() => Transaccion)
  @JoinColumn({ name: 'id_transaccion' }) // Nombre en minúsculas
  id_transaccion: Transaccion;

  @Column({
    type: 'enum',
    enum: TipoSueldo,
    name: 'tipo_sueldo', // Nombre en minúsculas
  })
  tipo_sueldo: TipoSueldo;

  @Column({ type: 'text', nullable: true, name: 'descripcion' }) // Nombre en minúsculas
  descripcion: string;
}
