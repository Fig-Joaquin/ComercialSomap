import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Transaccion } from './transaccionEntity';
import { CategoriaGasto } from './categoriaGastoEntity';

@Entity('gasto')
export class Gasto {
  @PrimaryGeneratedColumn()
  id_gasto: number;

  @ManyToOne(() => Transaccion, transaccion => transaccion.gastos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_transaccion' })
  transaccion: Transaccion;

  @Column({ length: 100 })
  nombre_gasto: string;

  @ManyToOne(() => CategoriaGasto, categoriaGasto => categoriaGasto.gastos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_categoria_gasto' })
  categoria_gasto: CategoriaGasto;
}
