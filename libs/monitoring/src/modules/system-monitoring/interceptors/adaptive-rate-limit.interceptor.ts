// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { SystemInfoStorageService } from '../system-info.service';
// import { RATE_LIMIT_KEY } from './rate-limit.decorator';

// const ONE_SECOND = 1000;

// @Injectable()
// export class AdaptiveRateLimitInterceptor implements NestInterceptor {
//   private currentWindowStart = Date.now();
//   private requestCount = 0;

//   constructor(private readonly systemInfoStorageService: SystemInfoStorageService) {}

//   async intercept(
//     context: ExecutionContext,
//     next: CallHandler,
//   ): Promise<Observable<any>> {
//     const now = Date.now();
//     const lastRecord = await this.systemInfoStorageService.getLastRecord();

//     if (!lastRecord) {
//       return next.handle();
//     }

//     const { cpu, memory, disk } = lastRecord;

//     const cpuLoad = cpu.currentLoad / 100;
//     const memLoad = memory.used / memory.total;
//     const diskLoad = Math.max(...disk.map((d: any) => d.use / 100));
//     const systemLoad = Math.max(cpuLoad, memLoad, diskLoad);

//     const rateLimit = this.getRateLimitFromMetadata(context);
//     let maxRPS: number;

//     if (rateLimit) {
//       maxRPS = rateLimit;
//     } else {
//       if (systemLoad > 0.9) maxRPS = 5;
//       else if (systemLoad > 0.75) maxRPS = 20;
//       else if (systemLoad > 0.5) maxRPS = 50;
//       else maxRPS = 100;
//     }

//     if (now - this.currentWindowStart > ONE_SECOND) {
//       this.currentWindowStart = now;
//       this.requestCount = 0;
//     }

//     ++this.requestCount;

//     if (this.requestCount > maxRPS) {
//       throw new HttpException(
//         'Too many requests: server is under load.',
//         HttpStatus.TOO_MANY_REQUESTS,
//       );
//     }

//     return next.handle();
//   }

//   private getRateLimitFromMetadata(context: ExecutionContext): number | undefined {
//     const handler = context.getHandler();
//     return Reflect.getMetadata(RATE_LIMIT_KEY, handler);
//   }
// }
