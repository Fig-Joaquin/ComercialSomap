import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { RolUsuario } from './rolUsuarioEntity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn({ name: 'id_rol' })
  id_rol: number;

  @Column({ length: 50, unique: true, name: 'rol' })
  rol: string;

  @OneToMany(() => RolUsuario, rolUsuario => rolUsuario.rol)
  rol_usuarios: RolUsuario[];

  @BeforeInsert()
  @BeforeUpdate()
  toLowerCase() {
    this.rol = this.rol.toLowerCase();
  }
}
