import { BaseError } from './base.error';

export class NotFoundError extends BaseError {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with identifier "${identifier}" was not found`
      : `${resource} was not found`;
    super(message, 'NOT_FOUND', 404);
  }
}
