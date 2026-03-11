export class BaseError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): {
    error: string;
    message: string;
    statusCode: number;
    details?: unknown;
  } {
    return {
      error: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}
