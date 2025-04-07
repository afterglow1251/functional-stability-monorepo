import { DynamicModule, Module } from '@nestjs/common';
import { ExceptionFilterConfig } from '../../shared/_types/logger.types';
import {
  CATCH_EVERYTHING_FILTER_CONFIG,
  CATCH_HTTP_EXCEPTION_FILTER_CONFIG,
} from '../../shared/providers/logger.providers';

@Module({})
export class LoggerFilterModule {
  static forRoot(config: ExceptionFilterConfig): DynamicModule {
    return {
      module: LoggerFilterModule,
      providers: [
        {
          provide: CATCH_EVERYTHING_FILTER_CONFIG,
          useValue: config,
        },
        {
          provide: CATCH_HTTP_EXCEPTION_FILTER_CONFIG,
          useValue: config,
        },
      ],
      exports: [CATCH_HTTP_EXCEPTION_FILTER_CONFIG, CATCH_EVERYTHING_FILTER_CONFIG],
    };
  }
}
