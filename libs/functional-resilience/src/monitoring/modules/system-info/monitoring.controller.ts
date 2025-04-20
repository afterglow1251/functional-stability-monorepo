import { SystemMonitoringService } from './monitoring.service';
import { Controller, Get, Query } from '@nestjs/common';
import { htmlTemplateStringCharts } from './sys-info-ui/system-monitoring-charts';
import { SystemInfoStorageService } from './sys-extra-services/storage/system-info-storage.service';

@Controller('v1/system-monitoring')
export class SystemMonitoringController {
  constructor(
    private readonly monitoringService: SystemMonitoringService,
    private readonly systemInfoStorageService: SystemInfoStorageService,
  ) {}

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

  @Get('historical')
  async getHistoricalData(@Query('limit') limit?: string) {
    const limitOrUndefined = limit ? parseInt(limit, 10) : undefined;
    return this.systemInfoStorageService.getLastMetrics(limitOrUndefined);
  }

  @Get('charts')
  getMonitoringHtml(): string {
    return htmlTemplateStringCharts;
  }
}
