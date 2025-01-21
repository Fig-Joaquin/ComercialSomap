import { ZodSchema } from 'zod';

export class ZodValidatorAdapter {
  private schema: ZodSchema<any>;

  constructor(schema: ZodSchema<any>) {
    this.schema = schema;
  }

  validateAndSanitize(data: any) {
    const parseResult = this.schema.safeParse(data);
    if (parseResult.success) {
      return { success: true, data: parseResult.data };
    } else {
      return { success: false, errors: parseResult.error.errors };
    }
  }
}
