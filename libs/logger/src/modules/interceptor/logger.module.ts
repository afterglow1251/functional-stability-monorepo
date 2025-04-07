import { DynamicModule, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerConfigInitial } from '../../shared/_types/logger.types';
import { LOGGER_CONFIG } from '../../shared/providers/logger.providers';

@Module({})
export class LoggerRequestModule {
  static forRoot(initialConfig: LoggerConfigInitial): DynamicModule {
    return {
      module: LoggerRequestModule,
      providers: [
        {
          provide: LOGGER_CONFIG,
          useValue: initialConfig,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}
