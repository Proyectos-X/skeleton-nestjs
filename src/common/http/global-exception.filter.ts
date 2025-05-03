import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { ErrorType } from '../enums/error-type.enum';
import { HttpErrorType } from './http-error-type';

/**
 * Extrae un mensaje legible desde una excepción.
 *
 * @param exception - La excepción lanzada (puede ser HttpException u otra cosa).
 * @returns El mensaje de error como cadena.
 */
export const getErrorMessage = (exception: unknown): string => {
  // Si la excepción es una HttpException, toma su mensaje
  if (exception instanceof HttpException) {
    const response = exception.getResponse();
    // Si es un objeto, verifica si tiene la propiedad 'message'
    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      const message = (response as { message: string | string[] }).message;
      // Si el 'message' es un array, devuelve el primero, o convierte a cadena
      return Array.isArray(message) ? message.join(', ') : message;
    }
    return typeof response === 'string' ? response : JSON.stringify(response);
  }
  // En caso de error no HttpException, convierte la excepción a cadena
  return String(exception);
};

/**
 * Filtro global que captura todas las excepciones no manejadas en la aplicación NestJS.
 * Centraliza el manejo de errores, estructurando las respuestas y registrando logs.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Método que se ejecuta automáticamente al capturar una excepción.
   *
   * @param exception - La excepción lanzada (esperada: HttpException).
   * @param host - Proporciona contexto sobre el tipo de solicitud (HTTP, RPC, WebSocket).
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = +exception.getStatus();

    // Se extraen datos personalizados del cuerpo de la excepción
    const parseException = exception.getResponse() as {
      errorType: ErrorType | HttpStatus.INTERNAL_SERVER_ERROR;
      message: string | string[];
    };

    let { errorType } = parseException;

    const errorMessage = getErrorMessage(parseException.message);

    // Si no se definió un tipo de error explícito, se asigna uno según el código HTTP
    if (!errorType) {
      errorType = HttpErrorType[status] as ErrorType;
      errorType = errorType ?? 'UNEXPECTED_ERROR';
    }

    this.logger.error(
      `Error: ${errorType}: ${errorMessage}`,
      exception instanceof Error ? exception.stack : '',
    );

    // Envío de la respuesta JSON al cliente con estructura estandarizada
    response.status(status).json({
      statusCode: status,
      path: request.url,
      errorType,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
