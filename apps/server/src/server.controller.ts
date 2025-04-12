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

@Controller()
export class ServerController {
  private attemptCounter = 0;
  private readonly logger = new Logger(ServerController.name);

  constructor(
    private readonly serverService: ServerService,
    // @Inject('MikroORM') private readonly mikroorm: any,
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
  // @UseInterceptors(LoggerInterceptor)
  getTest(): any {
    return { message: 'test' };
  }

  @Get('error')
  // @UseFilters(CatchHttpExceptionFilter)
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
}
