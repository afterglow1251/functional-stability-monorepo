import { SystemMonitoringService } from './monitoring.service';
import { Controller, Get } from '@nestjs/common';
import { htmlString } from './static/html-string';

@Controller('v1/system-monitoring')
export class SystemMonitoringController {
  constructor(private readonly monitoringService: SystemMonitoringService) {}

  @Get('all')
  async getAllSystemInfo() {
    return this.monitoringService.getAllSystemInfo();
  }

  @Get('cpu')
  async getCpu() {
    return this.monitoringService.getCpu();
  }

  @Get('memory')
  async getMemory() {
    return this.monitoringService.getMemory();
  }

  @Get('disk')
  async getDisk() {
    return this.monitoringService.getDisk();
  }

  @Get('processes')
  async getProcessLoad() {
    return this.monitoringService.getProcessLoad();
  }

  @Get('/charts')
  getMonitoringHtml() {
    return htmlString;
  }
}
