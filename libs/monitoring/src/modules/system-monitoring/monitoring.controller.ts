import { SystemMonitoringService } from './monitoring.service';
import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { htmlTemplateStringCharts } from './static/html-string';
import { SystemInfoStorageService } from './system-info.service';
import { MyRender } from './shared/decorators/render';

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

  @Get('charts')
  getMonitoringHtml() {
    return htmlTemplateStringCharts;
  }

  // @Get('charts-test')
  // getMonitoringHtmlTest(
  //   @MyRender('libs/monitoring/src/modules/system-monitoring/static/monitoring.html')
  //   res: string,
  // ) {
  //   return res;
  // }

  @Get('historical')
  async getHistoricalData(@Query('limit') limit?: string) {
    const limitOrUndefined = limit ? parseInt(limit, 10) : undefined;
    return this.systemInfoStorageService.getLastMetrics(limitOrUndefined);
  }
}
