import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { UsersModule } from './users/users.module';
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
import { DrizzleModule } from './db/drizzle/drizzle.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MySqlDriver } from '@mikro-orm/mysql';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './db/mikro-orm/user.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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

    SystemMonitoringModule.forRoot({
      cronExpression: '*/2 * * * * *',
      thresholds: {
        cpu: 40,
        memory: 40,
        disk: 40,
        processCpu: 40,
        processMemory: 40,
      },
      console: {
        on: false,
      },
      file: {
        on: false,
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
    // MongooseModule.forRoot(
    //   'mongodb+srv://yuriiafterglow:dew6Uo9zvX4Un2Rr@cluster0.7hwngpn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    // ),
    // HealthcheckModule,
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
