import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Usuario } from './usuarioEntity';
import { Cliente } from './clienteEntity';

@Entity('personas') // Nombre de la tabla en minúsculas
export class Persona {
  @PrimaryGeneratedColumn()
  id_persona: number; // Nombre del atributo en minúsculas

  @Column({ length: 12, unique: true })
  rut_persona: string; // Nombre del atributo en minúsculas

  @Column({ length: 100 })
  nombre: string; // Nombre del atributo en minúsculas

  @Column({ length: 100 })
  primer_apellido: string; // Nombre del atributo en minúsculas

  @Column({ length: 100 })
  segundo_apellido: string; // Nombre del atributo en minúsculas

  @Column({ length: 100 })
  email: string; // Nombre del atributo en minúsculas

  @Column({ length: 20 })
  telefono: string; // Nombre del atributo en minúsculas

  @OneToMany(() => Usuario, usuario => usuario.persona)
  usuarios: Usuario[]; // Nombre del atributo en minúsculas

  @OneToMany(() => Cliente, cliente => cliente.persona)
  clientes: Cliente[]; // Nombre del atributo en minúsculas

  @BeforeInsert()
  @BeforeUpdate()
  formatFields() {
    // Convertir rut_persona y email a minúsculas
    this.rut_persona = this.rut_persona.toLowerCase();

    if (this.email !== undefined || this.email !== null) {
      this.email = this.email.toLowerCase();
    }

    // Asegurar que el rut_persona termine con 'k' minúscula si es necesario
    const rutLength = this.rut_persona.length;

    if (rutLength > 1 && this.rut_persona[rutLength - 1].toLowerCase() === 'k') {
      this.rut_persona = this.rut_persona.slice(0, rutLength - 1) + 'k';
    }
  }
}
