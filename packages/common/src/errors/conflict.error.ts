import { BaseError } from './base.error';

export class ConflictError extends BaseError {
  constructor(message = 'The request conflicts with the current state of the resource') {
    super(message, 'CONFLICT', 409);
  }
}
