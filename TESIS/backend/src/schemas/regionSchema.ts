import { z } from 'zod';

export const regionSchema = z.object({
  nombre: z.string().max(100, "El nombre de la región no debe exceder los 100 caracteres"),
});
