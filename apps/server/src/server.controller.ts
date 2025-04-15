import {
  Controller,
  Get,
  Inject,
  Logger,
  Res,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ServerService } from './server.service';
import { CatchHttpExceptionFilter } from '@app/logger';
import { LoggerInterceptor } from '@app/logger/modules/interceptor/logger.interceptor';
import { Retry } from '@app/monitoring/modules/system-monitoring/shared/decorators/retry.decorator';
// import { RateLimit } from '@app/monitoring/modules/system-monitoring/interceptors/rate-limit.decorator';
import { BypassOverload } from '@app/monitoring/modules/system-monitoring/interceptors/priority.decorator';
import { HEALTH_MONGOOSE_PROVIDER } from '@app/monitoring';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person } from './db/mongoose/schema';

@BypassOverload()
@Controller()
export class ServerController {
  private attemptCounter = 0;
  private readonly logger = new Logger(ServerController.name);

  constructor(
    private readonly serverService: ServerService,
    // @InjectModel('Person') private readonly personModel: Model<Person>,
  ) {}

  @Get()
  @Retry({ attempts: 3, delay: 1000, strategy: 'linear' })
  async getHello(): Promise<string> {
    this.logger.log('GET hello controller');
    this.attemptCounter++;

    if (this.attemptCounter <= 2) {
      this.logger.error(`Attempt ${this.attemptCounter}: Temporary error occurred!`);
      throw new Error('Temporary error!');
    }

    return await this.serverService.getHello();
  }

  @Get('test')
  getTest(): any {
    return { message: 'test' };
  }

  @Get('test2')
  getTest2(): any {
    return { message: 'test2' };
  }

  @Get('error')
  getError(): string {
    return this.serverService.getError();
  }

  @Get('retry-test')
  @Retry({ attempts: 3, delay: 1000, strategy: 'linear' }) // Використовуємо лінійну затримку
  async retryTest(): Promise<string> {
    this.logger.log('Executing retryTest...');
    this.attemptCounter++;

    if (this.attemptCounter <= 2) {
      this.logger.error(`Attempt ${this.attemptCounter}: Temporary error occurred!`);
      throw new Error('Temporary error!');
    }

    // На третій спробі успішний результат
    return 'Success after retrying!';
  }

  // @Get('mongodb')
  // async createPerson(): Promise<Person> {
  //   const createdPerson = new this.personModel({ name: 'Yurii', age: 20 });
  //   return createdPerson.save();
  // }
}
