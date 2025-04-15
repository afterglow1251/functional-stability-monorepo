import { Injectable, LoggerService } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import pino from 'pino';

export const pinoConsoleLogger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

@Injectable()
export class PinoConsoleLoggerService implements LoggerService {
  private readonly logger: pino.Logger;

  constructor(private readonly cls: ClsService) {
    this.logger = pinoConsoleLogger;
  }

  error(message: any, stack?: string, context?: string) {
    const traceId = this.cls.get('traceId');
    if (message instanceof Error) {
      this.logger.error({ traceId }, this.getMessage(message.message, context));
      this.logger.error(message.stack);
    } else {
      this.logger.error({ traceId }, this.getMessage(message, context));
      if (stack) {
        this.logger.error(stack);
      }
    }
  }

  log(message: any, context?: string) {
    const traceId = this.cls.get('traceId');
    this.logger.info({ traceId }, this.getMessage(message, context));
  }

  warn(message: any, context?: string) {
    const traceId = this.cls.get('traceId');
    this.logger.warn({ traceId }, this.getMessage(message, context));
  }

  debug(message: any, context?: string) {
    const traceId = this.cls.get('traceId');
    this.logger.debug({ traceId }, this.getMessage(message, context));
  }

  verbose(message: any, context?: string) {
    const traceId = this.cls.get('traceId');
    this.logger.debug({ traceId }, this.getMessage(message, context));
  }

  private getMessage(message: any, context?: string) {
    const formatted =
      typeof message === 'object'
        ? `\n${JSON.stringify(message, null, 2)}`
        : message;

    return context ? `[ ${context} ] ${formatted}` : formatted;
  }
}
