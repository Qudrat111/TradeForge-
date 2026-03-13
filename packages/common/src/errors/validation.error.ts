import { BaseError } from './base.error';

export interface IValidationErrorDetail {
  field: string;
  message: string;
  value?: unknown;
}

export class ValidationError extends BaseError {
  constructor(
    message = 'Validation failed',
    public readonly errors: IValidationErrorDetail[] = [],
  ) {
    super(message, 'VALIDATION_ERROR', 422, errors);
  }

  override toJSON(): {
    error: string;
    message: string;
    statusCode: number;
    details?: unknown;
    errors: IValidationErrorDetail[];
  } {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}
