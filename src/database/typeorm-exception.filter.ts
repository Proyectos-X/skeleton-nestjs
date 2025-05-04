import { ConfigService } from '@nestjs/config';
import { QueryFailedError } from 'typeorm';
import type { Request, Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ErrorType } from '@/common/enums/error-type.enum';
import { DBErrorCode } from '@/common/enums/db-error-code.enum';

/**
 * Verifica si un error lanzado por TypeORM es un `QueryFailedError` con un código específico.
 *
 * @param error - El error lanzado por la base de datos.
 * @param code - El código de error de PostgreSQL (ej. '23505').
 * @returns true si el error coincide con el código indicado.
 */
function hasErrorCode(
  error: unknown,
  code: string,
): error is QueryFailedError & {
  code: string;
  driverError: { detail: string };
} {
  return (
    error instanceof QueryFailedError &&
    typeof (error as unknown as Record<string, unknown>)?.code === 'string' &&
    (error as unknown as Record<string, unknown>)?.code === code
  );
}

/**
 * Extrae de forma segura el mensaje `detail` del error lanzado por PostgreSQL.
 */
function getPostgresMessage(error: QueryFailedError): string {
  return error.driverError?.message ?? 'Error inesperado en la base de datos.';
}

/**
 * Filtro que captura errores SQL lanzados por TypeORM
 * y los traduce a respuestas HTTP estandarizadas y amigables.
 */
@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(TypeOrmExceptionFilter.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Maneja las excepciones de tipo `QueryFailedError`.
   *
   * @param exception - La excepción capturada de TypeORM.
   * @param host - Contexto del argumento, normalmente una petición HTTP.
   */
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Valores por defecto
    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorType: ErrorType = ErrorType.UnexpectedError;
    const message = getPostgresMessage(exception);

    // Verificar tipo de error PostgreSQL
    if (hasErrorCode(exception, DBErrorCode.PgUniqueConstraintViolation)) {
      status = HttpStatus.CONFLICT;
      errorType = ErrorType.UserExists;
    } else if (
      hasErrorCode(exception, DBErrorCode.PgForeignKeyConstraintViolation)
    ) {
      status = HttpStatus.BAD_REQUEST;
      errorType = ErrorType.ForeignKeyConflict;
    } else if (
      hasErrorCode(exception, DBErrorCode.PgNotNullConstraintViolation)
    ) {
      status = HttpStatus.BAD_REQUEST;
      errorType = ErrorType.ForeignKeyConflict;
    }

    // Logging interno del error
    this.logger.error(
      `QueryFailedError [${errorType}]: ${message}`,
      exception.stack,
    );

    // Envío de respuesta estandarizada
    response.status(status).json({
      statusCode: status,
      path: request.url,
      errorType,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
