import { DynamicModule, Module } from '@nestjs/common';
import { HealthcheckController } from './healthcheck.controller';

@Module({})
export class HealthcheckModule {
  static forRoot(): DynamicModule {
    return {
      module: HealthcheckModule,
      controllers: [HealthcheckController],
    };
  }
}
