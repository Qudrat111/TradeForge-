import { BaseError } from './base.error';

export class ForbiddenError extends BaseError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 'FORBIDDEN', 403);
  }
}
