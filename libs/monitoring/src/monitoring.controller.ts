import { MonitoringService } from './monitoring.service';
import { Controller, Get, Query } from '@nestjs/common';
import { MyRender } from './shared/decorators/render';

@Controller('monitoring-lib')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

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

  @Get('process')
  async getProcessLoad() {
    return this.monitoringService.getProcessLoad();
  }

  @Get('/monitoring.html')
  getMonitoringHtml(
    @MyRender('libs/monitoring/src/static/monitoring.html') html: string,
  ) {
    return html;
  }
}
