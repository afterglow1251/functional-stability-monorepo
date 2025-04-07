import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  Logger as NestLogger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionFilterConfig } from '../../shared/_types/logger.types';
import { CATCH_EVERYTHING_FILTER_CONFIG } from '../../shared/providers/logger.providers';
import { PinoFileLoggerService } from 'libs/shared/src';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  private readonly consoleLogger = new NestLogger(CatchEverythingFilter.name);
  private fileLogger?: PinoFileLoggerService;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(CATCH_EVERYTHING_FILTER_CONFIG)
    private readonly config: ExceptionFilterConfig,
  ) {
    if (config.file.on) {
      this.fileLogger = new PinoFileLoggerService(config.file.options);
    }
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus: number;
    let responseBody: any;

    const isError = exception instanceof Error;
    const stack = isError ? exception.stack : undefined;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();
      responseBody = {
        statusCode: httpStatus,
        ...(typeof response === 'object' ? response : { message: response }),
      };
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = isError ? exception.message : exception;
      responseBody = {
        statusCode: httpStatus,
        message,
      };
    }

    responseBody.timestamp = new Date().toISOString();
    responseBody.path = httpAdapter.getRequestUrl(ctx.getRequest());

    if (this.config.console.on) {
      this.consoleLogger.error(responseBody, stack);
    }

    if (this.config.file.on) {
      this.fileLogger!.error(responseBody, stack);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
