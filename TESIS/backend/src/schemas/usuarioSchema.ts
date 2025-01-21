import { z } from 'zod';

// Función para validar el RUT chileno
const validateRut = (rut: string) => {
  const rutClean = rut.replace(/\./g, '').replace(/-/g, '');
  const rutBody = rutClean.slice(0, -1);
  const dv = rutClean.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = rutBody.length - 1; i >= 0; i--) {
    suma += parseInt(rutBody.charAt(i), 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvValido = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dv === dvValido;
};

// Esquema Zod para validar el usuario
export const usuarioSchema = z.object({
  rut_persona: z.string()
    .min(1, 'El RUT es obligatorio')
    .regex(/^\d{1,8}-[0-9kK]{1}$/, 'Formato de RUT inválido')
    .refine(validateRut, 'RUT inválido'),
  contrasenia: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña no puede exceder 128 caracteres'),
});

export type UsuarioSchema = z.infer<typeof usuarioSchema>;
