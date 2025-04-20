import { LoggerService } from '@nestjs/common';
import { pino } from 'pino';
import { join } from 'path';

type LoggerFileOptions = {
  dir?: string;
  file?: string;
  frequency?: 'daily' | 'hourly' | number;
  mkdir?: boolean;
  dateFormat?: string;
};

export const DEFAULT_FILE_CONFIG = {
  dir: './logs',
  file: 'app.log',
  // frequency: 'hourly',
  mkdir: true,
  // dateFormat: 'yyyy-MM-dd-HH-mm-ss',
} as const;

export const pinoFileLogger = (options?: LoggerFileOptions) => {
  const {
    dir = DEFAULT_FILE_CONFIG.dir,
    file = DEFAULT_FILE_CONFIG.file,
    frequency,
    mkdir = DEFAULT_FILE_CONFIG.mkdir,
    dateFormat,
  } = options ?? {};

  return pino({
    level: 'debug',
    transport: {
      target: 'pino-roll',
      options: {
        file: join(dir, file),
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
}
