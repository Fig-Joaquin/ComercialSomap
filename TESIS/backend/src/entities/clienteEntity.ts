import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Persona } from './personaEntity';
import { Comuna } from './comunaEntity';
import { Pedidos } from './pedidos/pedidosEntity';
import { Descuentos } from './productos/descuentoProductoEntity';

@Entity('clientes') // Tabla en minúsculas
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente: number; // Atributo en minúsculas

  @ManyToOne(() => Persona, persona => persona.clientes)
  @JoinColumn({ name: 'rut_persona' }) // FK en minúsculas
  persona: Persona;

  @ManyToOne(() => Comuna, comuna => comuna.clientes)
  @JoinColumn({ name: 'id_comuna' }) // FK en minúsculas
  comuna: Comuna;

  @Column({ length: 255 })
  direccion: string; // Atributo en minúsculas

  @Column({ length: 100 })
  nombre_local: string; // Atributo en minúsculas

  @Column({ length: 100 })
  razon_social: string; // Atributo en minúsculas

  @Column({ length: 50 })
  giro: string; // Atributo en minúsculas

  @Column({ default: false })
  mora: boolean; // Atributo en minúsculas

  @OneToMany(() => Pedidos, pedido => pedido.cliente)
  pedidos: Pedidos[];

  @OneToMany(() => Descuentos, descuento => descuento.cliente)
  descuentos: Descuentos[];

}
