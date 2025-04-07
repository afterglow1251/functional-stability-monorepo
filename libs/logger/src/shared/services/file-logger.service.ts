import { pino } from 'pino';
import { LoggerFileOptions } from '../_types/logger.types';
import { join } from 'path';
import { DEFAULT_FILE_CONFIG } from '../constants/logger.constants';
import { LoggerService } from '@nestjs/common';

export const pinoFileLogger = (options?: LoggerFileOptions) => {
  const {
    dir = DEFAULT_FILE_CONFIG.dir,
    fileName = DEFAULT_FILE_CONFIG.fileName,
    frequency,
    mkdir = DEFAULT_FILE_CONFIG.mkdir,
    dateFormat,
  } = options ?? {};

  return pino({
    transport: {
      target: 'pino-roll',
      options: {
        file: join(dir, fileName),
        frequency,
        mkdir,
        dateFormat,
      },
    },
  });
};

export class PinoFileLoggerService implements LoggerService {
  private readonly logger: pino.Logger;

  constructor(options?: LoggerFileOptions) {
    this.logger = pinoFileLogger(options);
  }

  error(message: any, stack?: string) {
    this.logger.error({ ...message, stack });
  }

  log(message: any) {
    this.logger.info(message);
  }

  warn(message: any) {
    this.logger.warn(message);
  }

  debug(message: any) {
    this.logger.debug(message);
  }

  verbose(message: any) {
    this.logger.trace(message);
  }
}
