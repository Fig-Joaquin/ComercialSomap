import { ZodSchema, ZodError } from 'zod';
import validator from 'validator';

export class ZodValidatorAdapter {
  constructor(private zodSchema: ZodSchema<any>) {}

  async validateAndSanitizeAsync(data: any) {
    // Sanitizar datos
    const sanitizedData = this.sanitizeData(data);

    // Validar datos con Zod de forma asíncrona
    try {
      const parsedData = await this.zodSchema.parseAsync(sanitizedData);
      return { success: true, data: parsedData };
    } catch (error) {
      if (error instanceof ZodError) {
        return { success: false, errors: error.errors };
      }
      throw error; // Lanza otros errores inesperados
    }
  }

  private sanitizeData(data: any) {
    const sanitizedData = { ...data };
    for (const key in sanitizedData) {
      if (sanitizedData.hasOwnProperty(key) && typeof sanitizedData[key] === 'string') {
        sanitizedData[key] = validator.escape(sanitizedData[key]); // Sanitiza entrada
        sanitizedData[key] = validator.trim(sanitizedData[key]); // Elimina espacios innecesarios
      }
    }
    return sanitizedData;
  }
}
