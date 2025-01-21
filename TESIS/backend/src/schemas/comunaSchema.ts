import { z } from 'zod';

export const comunaSchema = z.object({
  nombre: z.string()
    .min(1, "El nombre de la comuna es obligatorio")
    .max(100, "El nombre de la comuna no debe exceder los 100 caracteres")
    .regex(/^[a-zA-Z\s]+$/, "El nombre solo puede contener letras y espacios"), // Solo letras y espacios
  id_region: z.number()
    .int("ID_Region debe ser un número entero")
    .positive("ID_Region debe ser un número positivo"),
});

export type ComunaSchema = z.infer<typeof comunaSchema>;
