import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger as NestLogger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { LoggerService } from './logger.service';
import { PinoFileLoggerService } from '../../../shared/services/file-logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly consoleLogger = new NestLogger(LoggerInterceptor.name);
  private fileLogger?: PinoFileLoggerService;

  constructor(private readonly loggerService: LoggerService) {
    const config = this.loggerService.getConfig();
    if (config.file.on) {
      this.fileLogger = new PinoFileLoggerService(config.file.options);
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const config = this.loggerService.getConfig();

    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;

        if (config.console.on) {
          const logData = this.loggerService.getConsoleLogData(req, res);

          if (this.loggerService.getDurationTarget('console')) {
            logData.duration = `${Math.floor(duration)}ms`;
          }

          this.consoleLogger.log(logData);
        }

        if (config.file.on) {
          const logData = this.loggerService.getFileLogData(req, res);

          if (this.loggerService.getDurationTarget('file')) {
            logData.duration = `${Math.floor(duration)}ms`;
          }

          this.fileLogger!.log({
            timestamp: new Date().toISOString(),
            ...logData,
          });
        }
      }),
    );
  }
}
