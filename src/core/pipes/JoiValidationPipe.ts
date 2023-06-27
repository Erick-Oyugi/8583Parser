import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { AnySchema, ObjectSchema, PresenceMode } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(
    private schema: ObjectSchema | AnySchema,
    private presence: PresenceMode,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(value: any) {
    const { error } = this.schema.validate(value, {
      presence: this.presence ?? 'required',
      abortEarly: false,
    });
    if (error) {
      throw new BadRequestException(
        { message: error.details, success: false, status: 400 },
        'Validation failed',
      );
    }
    return value;
  }
}
