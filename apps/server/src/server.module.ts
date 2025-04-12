import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import {
  CatchEverythingFilter,
  CatchHttpExceptionFilter,
  ExceptionFilterConfig,
  LoggerRequestModule,
} from 'libs/logger/src';
import { UsersModule } from './users/users.module';
import { TraceMiddleware } from 'libs/logger/src';
import { ClsModule } from 'nestjs-cls';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from 'libs/logger/src';
import { LoggerExceptionFilterModule } from 'libs/logger/src';
import { SystemMonitoringModule } from '@app/monitoring';
import { PinoConsoleLoggerService } from 'libs/shared/src';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeormDatabaseModule } from './db/typeorm/db.module';
import { SequelizeDatabaseModule } from './db/sequelize/db.module';
import { MongooseDatabaseModule } from './db/mongoose/db.module';
import { HealthcheckModule } from '@app/monitoring';
import { PrismaModule } from './db/prisma/prisma.module';
import { PostgresModule } from './db/postgres/pg.module';
import { MysqlModule } from './db/mysql/mysql.module';
import { DrizzleModule } from './db/drizzle/drizzle.module';
import { MikroOrmModuleDatabase } from './db/mikro-orm/mikro-orm.module';
import { OverloadProtectionInterceptor } from '@app/monitoring/modules/system-monitoring/interceptors/overload-protection.interceptor';

@Module({
  imports: [
    ClsModule.forRoot({ global: true }),
    LoggerRequestModule.forRoot({
      console: {
        on: true,
        targets: ['statusCode', 'url', 'method', 'duration'],
      },
      file: {
        on: true,
        options: { dir: './logs/my-logs' },
      },
    }),
    LoggerExceptionFilterModule.forRoot({
      console: {
        on: true,
      },
      file: {
        on: true,
        options: { dir: './logs/error-logs' },
      },
    }),
    SystemMonitoringModule.forRoot({
      cronExpression: '*/2 * * * * *',
      console: {
        on: true,
      },
      file: {
        on: true,
        options: {
          dir: './logs/monitoring-logs',
        },
      },
    }),
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'public'),
      serveRoot: '/',
    }),
    // HealthcheckModule.forRoot([
    //   MongooseDatabaseModule,
    //   TypeormDatabaseModule,
    //   SequelizeDatabaseModule,
    //   PrismaModule,
    //   // PostgresModule,
    //   MysqlModule,
    //   DrizzleModule,
    //   MikroOrmModuleDatabase,
    // ]),
  ],
  controllers: [ServerController],
  providers: [
    ServerService,
    PinoConsoleLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: OverloadProtectionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
  ],
})
export class ServerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceMiddleware).forRoutes('*');
  }
}
