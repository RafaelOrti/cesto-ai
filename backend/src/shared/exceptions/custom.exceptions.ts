import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, errorCode?: string) {
    super(
      {
        message,
        errorCode,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class NotFoundException extends HttpException {
  constructor(entity: string, id?: string) {
    const message = id ? `${entity} with id ${id} not found` : `${entity} not found`;
    super(
      {
        message,
        errorCode: 'ENTITY_NOT_FOUND',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ValidationException extends HttpException {
  constructor(message: string, details?: any) {
    super(
      {
        message,
        errorCode: 'VALIDATION_ERROR',
        details,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized access') {
    super(
      {
        message,
        errorCode: 'UNAUTHORIZED',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = 'Access forbidden') {
    super(
      {
        message,
        errorCode: 'FORBIDDEN',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class ConflictException extends HttpException {
  constructor(message: string, details?: any) {
    super(
      {
        message,
        errorCode: 'CONFLICT',
        details,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message = 'Internal server error') {
    super(
      {
        message,
        errorCode: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


