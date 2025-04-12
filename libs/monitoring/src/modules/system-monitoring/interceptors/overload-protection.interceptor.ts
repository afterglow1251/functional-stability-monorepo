import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { MonitoringCronService } from '../extra-services/monitoring-cron.service';
import { ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class OverloadProtectionInterceptor implements NestInterceptor {
  constructor(private readonly monitoringCronService: MonitoringCronService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isOverloaded = this.monitoringCronService.getIsSystemOverloaded();

    if (isOverloaded) {
      return throwError(
        () => new ServiceUnavailableException('Service Unavailable due to overload'),
      );
    }

    return next.handle();
  }
}
