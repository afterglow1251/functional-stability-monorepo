import { Injectable } from '@nestjs/common';
import * as si from 'systeminformation';
import { DEFAULT_PROCESS_NAME } from './shared/constants/monitoring.constants';

@Injectable()
export class MonitoringService {
  async getCpu() {
    const { currentLoad, currentLoadUser, currentLoadSystem, currentLoadIdle } =
      await si.currentLoad();
    return { currentLoad, currentLoadUser, currentLoadSystem, currentLoadIdle };
  }

  async getMemory() {
    const { total, free, used, available, swapused, swapfree } = await si.mem();
    return { total, free, used, available, swapused, swapfree };
  }

  async getDisk() {
    return si.fsSize();
  }

  async getProcessLoad() {
    return si.processLoad(DEFAULT_PROCESS_NAME);
  }

  async getAllSystemInfo() {
    const [
      { currentLoad, currentLoadUser, currentLoadSystem, currentLoadIdle },
      { total, free, used, available, swapused, swapfree },
      disk,
      processLoad,
    ] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.processLoad(DEFAULT_PROCESS_NAME),
    ]);

    return {
      cpu: { currentLoad, currentLoadUser, currentLoadSystem, currentLoadIdle },
      memory: { total, free, used, available, swapused, swapfree },
      disk,
      processLoad,
    };
  }
}
