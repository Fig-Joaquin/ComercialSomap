import { ZodSchema, ZodError } from 'zod';

export class ZodValidatorAdapter {
  constructor(private zodSchema: ZodSchema<any>) {}

  validateAndSanitize(data: any) {
    try {
      const parsedData = this.zodSchema.parse(data);
      return { success: true, data: parsedData };
    } catch (error) {
      if (error instanceof ZodError) {
        return { success: false, errors: error.errors };
      }
      return { success: false, errors: [{ message: 'Unknown error' }] };
    }
  }
}
