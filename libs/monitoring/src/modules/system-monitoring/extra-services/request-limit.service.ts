import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestLimitService {
  private isSystemOverloaded = false;

  setSystemOverloadStatus(isOverloaded: boolean) {
    this.isSystemOverloaded = isOverloaded;
  }

  isSystemOverloadedStatus(): boolean {
    return this.isSystemOverloaded;
  }
}
