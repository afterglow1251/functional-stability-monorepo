import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClsService } from 'nestjs-cls';
import { randomUUID } from 'crypto';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const traceId = req.headers['x-request-id'] ?? randomUUID();

    this.cls.run(() => {
      this.cls.set('traceId', traceId);
      next();
    });
  }
}
