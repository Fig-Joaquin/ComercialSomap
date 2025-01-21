import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Productos } from './productosEntity';

@Entity('movimientos_stock') // Tabla para manejar ingresos y egresos
export class MovimientosStock {
    @PrimaryGeneratedColumn()
    id_movimiento: number; // ID único del movimiento

    @ManyToOne(() => Productos, producto => producto.movimientosStock)
    @JoinColumn({ name: 'id_producto' }) // Relación con productos
    producto: Productos;

    @Column({ name: 'fecha_movimiento' }) // Fecha del movimiento
    fecha_movimiento: Date;
    // ! TRABAJAR EN UNIDADES
    @Column('decimal', { name: 'cantidad' }) // Cantidad involucrada
    cantidad: number;

    @Column({ name: 'tipo_movimiento' }) // Tipo: INGRESO o EGRESO
    tipo_movimiento: 'INGRESO' | 'EGRESO';

    @Column({ name: 'descripcion', nullable: true }) // Opcional: Detalles adicionales
    descripcion: string;

    @Column({ name: 'usuario_responsable', nullable: true }) // Opcional: Usuario responsable
    usuario_responsable: string;
}
