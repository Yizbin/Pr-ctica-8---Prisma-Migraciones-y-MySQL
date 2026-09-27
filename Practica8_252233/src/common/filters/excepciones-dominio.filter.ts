import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ExcepcionesDominioFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message || 'Error interno del servidor';

    const nombreError = exception.constructor?.name || '';

    if (
      nombreError.includes('NoEncontrado') ||
      message.toLowerCase().includes('no encontrad')
    ) {
      status = HttpStatus.NOT_FOUND;
    } else if (
      nombreError.includes('CupoLleno') ||
      nombreError.includes('Duplicad') ||
      message.toLowerCase().includes('cupo') ||
      message.toLowerCase().includes('ya está inscrito')
    ) {
      status = HttpStatus.CONFLICT;
    } else if (exception.status) {
      status = exception.status;
      message = exception.response?.message || exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}