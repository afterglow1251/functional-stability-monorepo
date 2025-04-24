import { Fallback } from '@app/functional-resilience';
import { CircuitBreaker } from '@app/functional-resilience/decorators/circuit-breaker.decorator';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class ServerService {
  private readonly logger = new Logger(ServerService.name);

  getHello(): any {
    this.logger.log('GET hello service');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Hello World!' });
      }, 1000);
    });
  }

  getError(): any {
    this.logger.log('GET error');
    throw new HttpException('test exception', HttpStatus.NOT_FOUND);
  }

  @Fallback({ data: 'default value' })
  // @Fallback((error) => {
  //   console.error('Operation failed', error);
  //   return { error: 'Something went wrong', details: error.message };
  // })

  // @Fallback(
  //   { default: 'No data' },
  //   { ignore: (error) => error.status === 404 } // Ignore 404 error
  // )
  async fallback(operation: string) {
    const res = await fetch(`https://some-api.com/weather/Kyiv`);
    return await res.json();
  }

  @CircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 2000,
  })
  async circuitBreaker() {
    if (Math.random() < 0.99) {
      throw new Error('Error while fetching');
    }
    return 'data fetched!';
  }
}
