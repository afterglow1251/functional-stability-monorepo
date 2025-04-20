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
      }, 100);
    });
  }

  getError(): any {
    this.logger.log('GET error');
    throw new HttpException('test exception', HttpStatus.NOT_FOUND);
  }

  // @Fallback((e) => ({
  //   temp: 18,
  //   condition: 'cached',
  //   note: 'API unreachable, fallback used',
  //   e: e.message,
  // }))
  @Fallback({ x: 'x' })
  async riskyOperation(operation: string) {
    const res = await fetch(`https://some-api.com/weather/Kyiv`);
    return await res.json();
  }

  @CircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 2000,
  })
  async fetchData() {
    console.log('QUERY TO SERVICE');
    if (Math.random() < 0.99) {
      throw new Error('Error while fetching');
    }
    return 'data fetched!';
  }
}
