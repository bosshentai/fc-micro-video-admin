import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Catch } from '@nestjs/common/decorators/core';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common/interfaces';
import { Response } from 'express';

@Catch(NotFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    response.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: exception.message,
    });
  }
}
