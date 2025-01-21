import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Gasto } from './gastoEntity';

export enum TipoTransaccion {
  INGRESO = 'ingreso',
  EGRESO = 'egreso',
}

@Entity('transacciones')
export class Transaccion {
  @PrimaryGeneratedColumn({ name: 'id_transaccion' }) // Nombre en minúsculas con guión bajo
  id_transaccion: number;

  @Column({ type: 'date', name: 'fecha' }) // Nombre en minúsculas
  fecha: Date;

  @Column({
    type: 'enum',
    enum: TipoTransaccion,
    name: 'tipo', // Nombre en minúsculas
  })
  tipo: TipoTransaccion;

  @OneToMany(() => Gasto, gasto => gasto.transaccion) // Relación renombrada a "transaccion"
  gastos: Gasto[];

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'monto' }) // Nombre en minúsculas
  monto: number;

  @Column({ type: 'text', nullable: true, name: 'descripcion' }) // Nombre en minúsculas
  descripcion: string;
}
