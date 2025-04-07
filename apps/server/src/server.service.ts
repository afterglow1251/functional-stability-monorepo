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
}
