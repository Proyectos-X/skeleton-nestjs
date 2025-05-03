import { ErrorType } from '../../enums/error-type.enum';
import { UnauthorizedException } from '@nestjs/common';

export class InvalidTokenException extends UnauthorizedException {
  constructor(message: string) {
    super({ errorType: ErrorType.InvalidToken, message });
  }
}
