import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseError } from '@tradeforge/common';

interface ErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
  details?: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let error: string;
    let message: string;
    let details: unknown;

    if (exception instanceof BaseError) {
      statusCode = exception.statusCode;
      error = exception.code;
      message = exception.message;
      details = exception.details;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        error = 'HTTP_EXCEPTION';
        message = res;
      } else {
        const resObj = res as Record<string, unknown>;
        error = (resObj['error'] as string | undefined) ?? 'HTTP_EXCEPTION';
        const msg = resObj['message'];
        message = Array.isArray(msg) ? msg.join('; ') : String(msg ?? exception.message);
        details = Array.isArray(msg) ? msg : undefined;
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'INTERNAL_SERVER_ERROR';
      message = 'An unexpected error occurred';
      this.logger.error(
        `Unhandled exception: ${String(exception)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    const body: ErrorResponse = {
      success: false,
      statusCode,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    if (details !== undefined) {
      body.details = details;
    }

    response.status(statusCode).json(body);
  }
}
