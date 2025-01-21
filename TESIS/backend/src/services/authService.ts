import { AppDataSource } from '../config/data-source';
import { Usuario } from '../entities/usuarioEntity';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt';

export const login = async (rut_persona: string, contrasenia: string) => {
  const usuarioRepository = AppDataSource.getRepository(Usuario);

  // Buscar usuario por RUT en minúsculas
  const usuario = await usuarioRepository.findOne({
    where: { persona: { rut_persona } },
    relations: ['persona', 'roles', 'roles.rol'],
  });

  if (!usuario) {
    throw new Error('RUT no encontrado');
  }

  // Validar contraseña
  const isPasswordValid = await bcrypt.compare(contrasenia, usuario.contrasenia);
  if (!isPasswordValid) {
    throw new Error('Contraseña incorrecta');
  }

  // Extraer roles en minúsculas
  const userRoles = usuario.roles.map((rolUsuario) => rolUsuario.rol.rol);

  // Generar token JWT
  const token = jwt.sign(
    { id_usuario: usuario.id_usuario, roles: userRoles },
    JWT_SECRET,
    { expiresIn: '5h' }
  );

  return { token, usuario };
};
