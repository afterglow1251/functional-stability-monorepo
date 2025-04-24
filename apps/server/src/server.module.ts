import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { ClsModule } from 'nestjs-cls';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
  OverloadProtectionInterceptor,
  PinoConsoleLoggerService,
  SystemMonitoringModule,
  TraceMiddleware,
} from '@app/functional-resilience';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

import {
  CatchEverythingFilter,
  LoggerExceptionFilterModule,
  LoggerInterceptor,
  LoggerRequestModule,
} from '@app/functional-resilience';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // ...
    ConfigModule.forRoot({ isGlobal: true }),
    // ...
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'public'),
      serveRoot: '/',
    }),
    // not necessarily (you can use it with healthcheck utils)
    ScheduleModule.forRoot(),
    // for traceId (optional)
    ClsModule.forRoot({ global: true }),
    // flexible configuration
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
    // flexible configuration
    LoggerExceptionFilterModule.forRoot({
      console: {
        on: true,
      },
      file: {
        on: true,
        options: { dir: './logs/error-logs' },
      },
    }),

    HealthcheckModule,

    // ...
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // SystemMonitoringModule.forRoot({
    //   cronExpression: '*/2 * * * * *',
    //   thresholds: {
    //     cpu: 100,
    //     memory: 100,
    //     disk: 100,
    //     processCpu: 100,
    //     processMemory: 100,
    //   },
    //   console: {
    //     on: true,
    //   },
    //   file: {
    //     on: false,
    //     options: {
    //       dir: './logs/monitoring-logs',
    //     },
    //   },
    // }),

    // DrizzleModule,
    // MikroOrmModule.forRoot({
    //   entities: [User],
    //   entitiesTs: [User],
    //   dbName: 'my_db',
    //   driver: MySqlDriver,
    //   host: 'localhost',
    //   port: 3306,
    //   user: 'root',
    //   password: 'root',
    // }),
  ],
  controllers: [ServerController],
  providers: [
    ServerService,
    PinoConsoleLoggerService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: OverloadProtectionInterceptor,
    // },
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
  // you must import ClsModule for middleware dependency
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceMiddleware).forRoutes('*');
  }
}
