import { DynamicModule, Module, Type } from '@nestjs/common';
import { HealthcheckController } from './healthcheck.controller';
import {
  SEQUELIZE_PROVIDER_TOKEN,
  DRIZZLE_PROVIDER_TOKEN,
  MIKRO_ORM_PROVIDER_TOKEN,
  PRISMA_PROVIDER_TOKEN,
  TYPEORM_PROVIDER_TOKEN,
  MONGOOSE_PROVIDER_TOKEN,
  POSTGRES_PROVIDER_TOKEN,
  MYSQL_PROVIDER_TOKEN,
} from './shared/provider-tokens';

@Module({})
export class HealthcheckModule {
  static forRoot(options: {
    drizzle?: { providerToken: string | symbol; module: Type<any> };
    sequelize?: { providerToken: string | symbol; module: Type<any> };
    mikroOrm?: { providerToken: string | symbol; module: Type<any> };
    prisma?: { providerToken: string | symbol; module: Type<any> };
    typeOrm?: { providerToken: string | symbol; module: Type<any> };
    mongoose?: { providerToken: string | symbol; module: Type<any> };
    postgres?: { providerToken: string | symbol; module: Type<any> };
    mysql?: { providerToken: string | symbol; module: Type<any> };
  }): DynamicModule {
    const imports = [
      options.drizzle?.module,
      options.sequelize?.module,
      options.mikroOrm?.module,
      options.prisma?.module,
      options.typeOrm?.module,
      options.mongoose?.module,
      options.postgres?.module,
      options.mysql?.module,
    ].filter(Boolean) as Type<any>[];

    const providers = [
      options.drizzle && {
        provide: DRIZZLE_PROVIDER_TOKEN,
        useExisting: options.drizzle.providerToken,
      },
      options.sequelize && {
        provide: SEQUELIZE_PROVIDER_TOKEN,
        useExisting: options.sequelize.providerToken,
      },
      options.mikroOrm && {
        provide: MIKRO_ORM_PROVIDER_TOKEN,
        useExisting: options.mikroOrm.providerToken,
      },
      options.prisma && {
        provide: PRISMA_PROVIDER_TOKEN,
        useExisting: options.prisma.providerToken,
      },
      options.typeOrm && {
        provide: TYPEORM_PROVIDER_TOKEN,
        useExisting: options.typeOrm.providerToken,
      },
      options.mongoose && {
        provide: MONGOOSE_PROVIDER_TOKEN,
        useExisting: options.mongoose.providerToken,
      },
      options.postgres && {
        provide: POSTGRES_PROVIDER_TOKEN,
        useExisting: options.postgres.providerToken,
      },
      options.mysql && {
        provide: MYSQL_PROVIDER_TOKEN,
        useExisting: options.mysql.providerToken,
      },
    ].filter(Boolean); // Фільтруємо undefined значення

    const exports = [
      options.drizzle && DRIZZLE_PROVIDER_TOKEN,
      options.sequelize && SEQUELIZE_PROVIDER_TOKEN,
      options.mikroOrm && MIKRO_ORM_PROVIDER_TOKEN,
      options.prisma && PRISMA_PROVIDER_TOKEN,
      options.typeOrm && TYPEORM_PROVIDER_TOKEN,
      options.mongoose && MONGOOSE_PROVIDER_TOKEN,
      options.postgres && POSTGRES_PROVIDER_TOKEN,
      options.mysql && MYSQL_PROVIDER_TOKEN,
    ].filter(Boolean) as (string | symbol)[];

    return {
      imports,
      module: HealthcheckModule,
      providers: providers as any[], // Приводимо до типу any[] для коректного типу
      controllers: [HealthcheckController],
      exports,
    };
  }
}
