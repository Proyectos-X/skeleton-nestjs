import { ErrorType } from '@/common/enums/error-type.enum';
import { ConflictException } from '@nestjs/common';
export class AlreadyExistsException extends ConflictException {
  constructor(message: string) {
    super({
      errorType: ErrorType.AlreadyExists,
      message: `There's a register '${message}'`,
    });
  }
}
