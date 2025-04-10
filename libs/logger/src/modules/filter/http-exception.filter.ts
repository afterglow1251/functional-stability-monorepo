import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Inject,
  Logger as NestLogger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CATCH_HTTP_EXCEPTION_FILTER_CONFIG } from './shared/providers';
import { PinoFileLoggerService } from 'libs/shared/src';
import { ExceptionFilterConfig } from '../../shared/_types/logger.types';

@Catch(HttpException)
export class CatchHttpExceptionFilter implements ExceptionFilter {
  private readonly consoleLogger = new NestLogger(CatchHttpExceptionFilter.name);
  private fileLogger?: PinoFileLoggerService;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(CATCH_HTTP_EXCEPTION_FILTER_CONFIG)
    private readonly config: ExceptionFilterConfig,
  ) {
    if (config.file.on) {
      this.fileLogger = new PinoFileLoggerService(config.file.options);
    }
  }

  catch(exception: HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = exception.getResponse();

    const status = exception.getStatus();
    const responseBody = {
      statusCode: status,
      ...(typeof response === 'object' ? response : { message: response }),
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    if (this.config.console.on) {
      this.consoleLogger.error(responseBody, exception.stack);
    }

    if (this.config.file.on) {
      this.fileLogger!.error(responseBody, exception.stack);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
