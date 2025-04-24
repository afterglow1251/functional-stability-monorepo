import { Controller, Get, Logger } from '@nestjs/common';
import { ServerService } from './server.service';
import { BypassOverload, Retry } from '@app/functional-resilience';

@Controller()
export class ServerController {
  private attemptCounter = 0;
  private readonly logger = new Logger(ServerController.name);

  constructor(private readonly serverService: ServerService) {}

  // @BypassOverload()
  @Get()
  @Retry({ attempts: 3, delay: 1000, strategy: 'linear' })
  // @Retry({ attempts: 3, delay: 1000, strategy: 'exponential' })

  // @Retry({
  //   attempts: 5,
  //   delay: 1000,
  //   strategy: (attempt) => 500 * attempt,
  // })
  async getHello(): Promise<string> {
    this.logger.log('GET hello controller');
    this.attemptCounter++;

    if (this.attemptCounter <= 2) {
      this.logger.error(`Attempt ${this.attemptCounter}: Temporary error occurred!`);
      throw new Error('Temporary error!');
    }

    return await this.serverService.getHello();
  }

  @Get('error')
  getError(): string {
    return this.serverService.getError();
  }

  @Get('fallback')
  riskyOperation() {
    return this.serverService.fallback('operation');
  }

  @Get('fetch')
  async circuitBreaker() {
    return await this.serverService.circuitBreaker();
  }
}
