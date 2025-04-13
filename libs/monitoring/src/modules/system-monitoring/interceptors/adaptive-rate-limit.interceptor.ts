// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { MonitoringCronService } from '../extra-services/monitoring-cron.service';
// import { RATE_LIMIT_KEY } from './rate-limit.decorator';
// import 'reflect-metadata'; // це імпортується на самому початку проекту (зазвичай в main.ts)

// @Injectable()
// export class AdaptiveRateLimitInterceptor implements NestInterceptor {
//   private currentWindowStart = Date.now();
//   private requestCount = 0;

//   constructor(private readonly monitoringCronService: MonitoringCronService) {}

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const now = Date.now();
//     const { cpu, memory, disk } =
//       this.monitoringCronService.getSystemMetrics() ?? {};

//     if (cpu === undefined || memory === undefined || disk === undefined) {
//       return next.handle();
//     }

//     // Нормалізація навантаження: 0–1
//     const cpuLoad = cpu / 100;
//     const memLoad = memory.used / memory.total;
//     const diskLoad = Math.max(...disk.map((d: any) => d.use / 100));
//     const systemLoad = Math.max(cpuLoad, memLoad, diskLoad);

//     // Перевірка ліміту для конкретного методу через декоратор
//     const rateLimit = this.getRateLimitFromMetadata(context);

//     let maxRPS: number;

//     if (rateLimit) {
//       maxRPS = rateLimit;
//     } else {
//       if (systemLoad > 0.9) maxRPS = 5;
//       else if (systemLoad > 0.75) maxRPS = 20;
//       else if (systemLoad > 0.5) maxRPS = 50;
//       else maxRPS = 100; // Значення за замовчуванням
//     }

//     // Якщо нове "вікно" — обнуляємо лічильник
//     if (now - this.currentWindowStart > 1000) {
//       this.currentWindowStart = now;
//       this.requestCount = 0;
//     }

//     this.requestCount++;

//     if (this.requestCount > maxRPS) {
//       throw new HttpException(
//         'Too many requests: server is under load.',
//         HttpStatus.TOO_MANY_REQUESTS,
//       );
//     }

//     return next.handle();
//   }

//   // Отримання ліміту з метаданих, який вказаний декоратором
//   private getRateLimitFromMetadata(context: ExecutionContext): number | undefined {
//     const handler = context.getHandler();
//     // Тепер правильно використовуємо Reflect.getMetadata
//     return Reflect.getMetadata(RATE_LIMIT_KEY, handler); // отримуємо ліміт з метаданих
//   }
// }
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MetricsStorageService } from '../metrics-storage.service';
import { RATE_LIMIT_KEY } from './rate-limit.decorator';

@Injectable()
export class AdaptiveRateLimitInterceptor implements NestInterceptor {
  private currentWindowStart = Date.now();
  private requestCount = 0;

  constructor(private readonly metricsStorageService: MetricsStorageService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const now = Date.now();
    const latestMetrics = await this.metricsStorageService.getLastRecord();

    if (!latestMetrics) {
      return next.handle();
    }

    const { cpu, memory, disk } = latestMetrics;

    const cpuLoad = cpu.currentLoad / 100;
    const memLoad = memory.used / memory.total;
    const diskLoad = Math.max(...disk.map((d: any) => d.use / 100));
    const systemLoad = Math.max(cpuLoad, memLoad, diskLoad);

    const rateLimit = this.getRateLimitFromMetadata(context);
    let maxRPS: number;

    if (rateLimit) {
      maxRPS = rateLimit;
    } else {
      if (systemLoad > 0.9) maxRPS = 5;
      else if (systemLoad > 0.75) maxRPS = 20;
      else if (systemLoad > 0.5) maxRPS = 50;
      else maxRPS = 100;
    }

    if (now - this.currentWindowStart > 1000) {
      this.currentWindowStart = now;
      this.requestCount = 0;
    }

    this.requestCount++;

    if (this.requestCount > maxRPS) {
      throw new HttpException(
        'Too many requests: server is under load.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return next.handle();
  }

  private getRateLimitFromMetadata(context: ExecutionContext): number | undefined {
    const handler = context.getHandler();
    return Reflect.getMetadata(RATE_LIMIT_KEY, handler);
  }
}
