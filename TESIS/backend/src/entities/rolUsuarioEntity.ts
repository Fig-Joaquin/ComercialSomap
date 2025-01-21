import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuarioEntity';
import { Rol } from './rolesEntity';

@Entity('rol_usuario') // Nombre consistente en minúsculas y con guión bajo
export class RolUsuario {
  @PrimaryGeneratedColumn({ name: 'id_rol_usuario' })
  id_rol_usuario: number;

  @ManyToOne(() => Usuario, usuario => usuario.roles)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Rol, rol => rol.rol_usuarios)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;
}
