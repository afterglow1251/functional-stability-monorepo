import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { MonitoringCronService } from '../../sys-extra-services/monitoring-cron.service';
import { Reflector } from '@nestjs/core';
import { BYPASS_OVERLOAD_KEY } from './bypass-overload.decorator';

@Injectable()
export class OverloadProtectionInterceptor implements NestInterceptor {
  constructor(
    private readonly monitoringCronService: MonitoringCronService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isOverloaded = this.monitoringCronService.getIsSystemOverloaded();

    const shouldBypass =
      this.reflector.get<boolean>(BYPASS_OVERLOAD_KEY, context.getHandler()) ??
      this.reflector.get<boolean>(BYPASS_OVERLOAD_KEY, context.getClass());

    if (isOverloaded && !shouldBypass) {
      return throwError(() => new ServiceUnavailableException('System overloaded'));
    }

    return next.handle();
  }
}
