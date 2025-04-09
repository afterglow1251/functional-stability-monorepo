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
import { PinoConsoleLoggerService } from 'libs/shared/src';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeormDatabaseModule } from './db/typeorm/db.module';
import { SequelizeDatabaseModule } from './db/sequelize/db.module';
import { initializeMikroOrm } from './db/mikro-orm';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseDatabaseModule } from './db/mongoose/db.module';
import { HealthcheckModule } from '@app/monitoring';

// initializeMikroOrm();

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
    LoggerFilterModule.forRoot({
      console: {
        on: true,
      },
      file: {
        on: true,
        options: { dir: './logs/error-logs' },
      },
    }),
    // MonitoringModule.forRoot({
    //   cronExpression: '*/2 * * * * *',
    //   console: {
    //     on: false,
    //   },
    //   file: {
    //     on: false,
    //     options: {
    //       dir: './logs/monitoring-logs',
    //     },
    //   },
    // }),
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'public'),
      serveRoot: '/',
    }),
    // TypeormDatabaseModule,
    // SequelizeDatabaseModule,
    MongooseDatabaseModule,
    // MongooseModule.forRoot(
    //   'mongodb+srv://yuriiafterglow:iOrGuFUnw2jtwAVC@cluster0.7hwngpn.mongodb.net/',
    // ),
    // HealthcheckModule.forRoot({
    //   // mysql: mysqlClient,
    //   // drizzle: drizzleOrm,
    //   // prisma: prisma,
    //   // mongoose: mongooseClient,
    // }),
    HealthcheckModule.forRoot(),
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
