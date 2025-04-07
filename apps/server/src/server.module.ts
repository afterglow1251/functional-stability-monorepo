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
import { LoggerFilterModule } from 'libs/logger/src';
import { MonitoringModule } from '@app/monitoring';
import { PinoConsoleLoggerService } from '@app/logger/shared/services/console-logger.service';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ClsModule.forRoot({ global: true }),
    LoggerRequestModule.forRoot({
      console: {
        on: false,
        targets: ['statusCode', 'url', 'method', 'duration'],
      },
      file: {
        on: false,
        options: { dir: './logs/my-logs' },
      },
    }),
    LoggerFilterModule.forRoot({
      console: {
        on: false,
      },
      file: {
        on: false,
        options: { dir: './logs/error-logs' },
      },
    }),
    MonitoringModule.forRoot({
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
  ],
  controllers: [ServerController],
  providers: [
    ServerService,
    PinoConsoleLoggerService,
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
