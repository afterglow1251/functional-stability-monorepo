import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import {
  checkMongooseHealth,
  PinoFileLoggerService,
} from '@app/functional-resilience';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

/*
TODO
const mongooseCheker = createDbHealthChecker((db: any) =>
  db.db.command({ ping: 1 }),
);
 */

/* 
TODO
async function checkApiHealth(): Promise<any> {
  const response = await fetch('https://api.example.com/health');
  if (!response.ok) {
    throw new Error('API не працює!');
  }
  return response.json();
}

const checkApiHealthChecker = createHealthChecker(checkApiHealth);

checkApiHealthChecker().then(result => {
  console.log('API здоровий:', result);
}).catch(error => {
  console.error('Помилка перевірки API:', error);
});
*/

@Injectable()
export class HealthcheckService {
  private readonly logger = new Logger(HealthcheckService.name);
  private readonly fileLogger = new PinoFileLoggerService({
    dir: './logs/db-health',
  });

  constructor(@InjectConnection() private readonly mongodb: Connection) {
    // @Inject(MikroORM) private readonly mikroOrm: MikroORM,
    // @Inject(drizzleProvideToken) private readonly drizzle: any,
  }

  // @Interval(1000)
  async checkMongoose() {
    const { ok, error } = await checkMongooseHealth(this.mongodb);

    if (ok) {
      this.logger.debug('Mongoose connection is healthy');
      this.fileLogger.debug('Mongoose connection is healthy');
    } else {
      this.logger.error('Mongoose connection failed', error.stack);
      this.fileLogger.error('Mongoose connection failed', error.stack);
    }
  }

  // or @Cron(...)
  // @Interval(5000)
  // async checkDrizzle() {
  //   const { ok, error } = await checkDrizzleHealth(this.drizzle);

  //   if (ok) {
  //     this.logger.debug('Drizzle connection is healthy');
  //     this.fileLogger.debug('Drizzle connection is healthy');
  //   } else {
  //     this.logger.error('Drizzle connection failed', error.stack);
  //     this.fileLogger.error('Drizzle connection failed', error.stack);
  //   }
  // }

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
}
