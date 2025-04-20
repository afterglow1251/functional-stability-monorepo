import { Inject, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { drizzleProvideToken } from '../db/drizzle';
import { checkDrizzleHealth } from '@app/functional-resilience/monitoring/modules/healthcheck/utils';
import { PinoFileLoggerService } from '@app/functional-resilience';
import { MikroORM } from '@mikro-orm/mysql';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthcheckService {
  private readonly logger = new Logger(HealthcheckService.name);
  private readonly fileLogger = new PinoFileLoggerService({
    dir: './logs/db-health',
  });

  constructor(
    @Inject(drizzleProvideToken) private readonly drizzle: any,
    @Inject(MikroORM) private readonly mikroOrm: MikroORM,
    @InjectConnection() private readonly mongodb: Connection,
  ) {}

  @Interval(5000)
  async checkDrizzle() {
    const { ok, error } = await checkDrizzleHealth(this.drizzle);

    if (ok) {
      this.logger.debug('Drizzle connection is healthy');
      this.fileLogger.debug('Drizzle connection is healthy');
    } else {
      this.logger.error('Drizzle connection failed', error.stack);
      this.fileLogger.error('Drizzle connection failed', error.stack);
    }
  }

  // @Interval(1000)
  // async checkMikroOrm() {
  //   const { ok, error } = await checkMikroOrmConnection(this.mikroOrm);

  //   if (ok) {
  //     this.logger.debug('MikroORM connection is healthy');
  //     this.fileLogger.debug('MikroORM connection is healthy');
  //   } else {
  //     this.logger.error('MikroORM connection failed', error.stack);
  //     this.fileLogger.error('MikroORM connection failed', error.stack);
  //   }
  // }

  // @Interval(1000)
  // async checkMongoose() {
  //   const { ok, error } = await checkDbConnection({ mongoose: this.mongodb });

  //   if (ok) {
  //     this.logger.debug('Mongoose connection is healthy');
  //     this.fileLogger.debug('Mongoose connection is healthy');
  //   } else {
  //     this.logger.error('Mongoose connection failed', error.stack);
  //     this.fileLogger.error('Mongoose connection failed', error.stack);
  //   }
  // }
}
