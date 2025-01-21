import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Persona } from './personaEntity';
import { RolUsuario } from './rolUsuarioEntity';

@Entity('usuarios') // Nombre de la tabla en minúsculas
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' }) // Nombre de la columna en minúsculas y con guión bajo
  id_usuario: number;

  @ManyToOne(() => Persona, persona => persona.usuarios)
  @JoinColumn({ name: 'id_persona' }) // Nombre de la columna en minúsculas y con guión bajo
  persona: Persona;

  @Column({ name: 'contrasenia' }) // Nombre consistente en minúsculas
  contrasenia: string;

  @OneToMany(() => RolUsuario, rolUsuario => rolUsuario.usuario)
  roles: RolUsuario[];
}
