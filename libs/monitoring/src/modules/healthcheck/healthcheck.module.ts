import { DynamicModule, Module, Type } from '@nestjs/common';
import { HealthcheckController } from './healthcheck.controller';

@Module({})
export class HealthcheckModule {
  static forRoot(dbModules: Type<any>[]): DynamicModule {
    return {
      module: HealthcheckModule,
      imports: dbModules,
      controllers: [HealthcheckController],
    };
  }
}
