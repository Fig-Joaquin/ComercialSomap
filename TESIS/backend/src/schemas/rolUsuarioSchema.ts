import { z } from 'zod';

export const rolUsuarioSchema = z.object({
  id_usuario: z.number().int('ID_Usuario debe ser un número entero'),
  id_rol: z.number().int('ID_Rol debe ser un número entero'),
});

export type RolUsuarioSchema = z.infer<typeof rolUsuarioSchema>;
