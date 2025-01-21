import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Productos } from './productosEntity';
import { Cliente } from '../clienteEntity';

@Entity('descuentos')
export class Descuentos {
  @PrimaryGeneratedColumn()
  id_descuento: number;

  @ManyToOne(() => Productos, producto => producto.descuentos, { eager: true })
  @JoinColumn({ name: 'id_producto' }) // Nombre de la columna FK
  producto: Productos;

  @ManyToOne(() => Cliente, cliente => cliente.descuentos, { nullable: true, eager: true })
  @JoinColumn({ name: 'id_cliente' }) // Nombre de la columna FK
  cliente: Cliente | null; // Permitir null


  @Column('decimal', { name: 'porcentaje_descuento' })
  porcentaje_descuento: number;

  @Column({ name: 'fecha_inicio' })
  fecha_inicio: Date;
  
  @Column({ name: 'fecha_fin', type: 'timestamp', nullable: true }) // Definir explícitamente el tipo como 'timestamp'
  fecha_fin: Date | null; // Permitir valores nulos
  
}
