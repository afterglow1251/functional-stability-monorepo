import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RequestLimitService } from '../extra-services/request-limit.service';
import { ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class RequestLimitInterceptor implements NestInterceptor {
  constructor(private readonly requestLimitService: RequestLimitService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isOverloaded = this.requestLimitService.isSystemOverloadedStatus();

    if (isOverloaded) {
      return throwError(
        () => new ServiceUnavailableException('Service Unavailable due to overload'),
      );
    }

    return next.handle();
  }
}
