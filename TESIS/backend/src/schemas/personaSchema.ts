import { z } from 'zod';

// Función para validar el dígito verificador del RUT
function validarRut(rutCompleto: string): boolean {
  if (!/^\d+-[0-9kK]$/.test(rutCompleto)) {
    return false;
  }

  const [rut, digitoVerificador] = rutCompleto.split('-');
  let suma = 0;
  let multiplicador = 2;

  for (let i = rut.length - 1; i >= 0; i--) {
    suma += parseInt(rut.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  let dv: string;
  if (dvEsperado === 11) {
    dv = '0';
  } else if (dvEsperado === 10) {
    dv = 'k';
  } else {
    dv = dvEsperado.toString();
  }

  return dv === digitoVerificador.toLowerCase();
}

export const personaSchemaRegistro = z.object({
  rut_persona: z.string().refine(validarRut, {
    message: 'RUT inválido. Verifique el dígito verificador y el formato.',
  }),
  nombre: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre debe tener menos de 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  primer_apellido: z.string()
    .min(1, 'El primer apellido es obligatorio')
    .max(100, 'El primer apellido debe tener menos de 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El primer apellido solo puede contener letras'),
  segundo_apellido: z.string()
    .max(100, 'El segundo apellido debe tener menos de 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, 'El segundo apellido solo puede contener letras')
    .optional(),  // Segundo apellido es opcional
  email: z.string()
    .email('Email inválido')
    .min(6, 'El email introducido debe tener más de 6 caracteres')
    .max(100, 'El email debe tener menos de 100 caracteres')
    .optional()
    .transform((email) => email ? email.toLowerCase() : email),  // Email es opcional
  telefono: z.string()
    .min(9, 'El teléfono debe tener al menos 9 caracteres')
    .max(20, 'El teléfono debe tener menos de 20 caracteres')
    .regex(/^\d+$/, 'El teléfono solo puede contener números')
});

export type PersonaRegistroSchema = z.infer<typeof personaSchemaRegistro>;
export const personaSchemaActualizacion = personaSchemaRegistro.partial();
export type PersonaActualizacionSchema = z.infer<typeof personaSchemaActualizacion>;
