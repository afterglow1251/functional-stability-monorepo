import { DynamicModule, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LOGGER_INTERCEPTOR_CONFIG } from './shared/provider-tokens';
import { LoggerConfigInitial } from '../../shared/_types/logger.types';

@Module({})
export class LoggerRequestModule {
  static forRoot(initialConfig: LoggerConfigInitial): DynamicModule {
    return {
      module: LoggerRequestModule,
      providers: [
        {
          provide: LOGGER_INTERCEPTOR_CONFIG,
          useValue: initialConfig,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}
