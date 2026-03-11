import { BaseError } from './base.error';

export class UnauthorizedError extends BaseError {
  constructor(message = 'Authentication is required to access this resource') {
    super(message, 'UNAUTHORIZED', 401);
  }
}
