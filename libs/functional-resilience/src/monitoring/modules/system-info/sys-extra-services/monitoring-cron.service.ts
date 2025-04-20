import {
  Inject,
  Injectable,
  Logger as NestLogger,
  OnModuleInit,
} from '@nestjs/common';
import { SystemMonitoringService } from '../monitoring.service';
import { SYSTEM_MONITORING_CONFIG } from '../shared/provider-tokens/monitoring.provider';
import { MonitoringModuleConfig } from '../shared/_types/monitoring.types';
import { SystemMonitoringAlertService } from './alert.service';
import { SystemInfoStorageService } from './storage/system-info-storage.service';
import * as cron from 'node-cron';

@Injectable()
export class MonitoringCronService implements OnModuleInit {
  private readonly consoleLogger = new NestLogger(MonitoringCronService.name);

  private isSystemOverloaded: boolean = false;

  constructor(
    @Inject(SYSTEM_MONITORING_CONFIG)
    private readonly config: MonitoringModuleConfig,
    private readonly monitoringService: SystemMonitoringService,
    private readonly alertService: SystemMonitoringAlertService,
    private readonly systemInfoStorageService: SystemInfoStorageService,
  ) {}

  onModuleInit() {
    if (!cron.validate(this.config.cronExpression)) {
      this.consoleLogger.error(
        `Invalid cron expression: ${this.config.cronExpression}`,
      );
      throw new Error('Invalid cron expression');
    }

    this.startCronJob();
  }

  private startCronJob() {
    cron.schedule(this.config.cronExpression, async () => {
      await this.updateSystemMetrics();
    });
  }

  private setSystemOverloadStatus(warnings: string[]) {
    this.isSystemOverloaded = warnings.length > 0;
  }

  getIsSystemOverloaded(): boolean {
    return this.isSystemOverloaded;
  }

  async updateSystemMetrics() {
    const { cpu, memory, disk, processLoad } =
      await this.monitoringService.getAllSystemInfo();

    const metric = {
      timestamp: Date.now(),
      cpu,
      memory,
      disk,
      processLoad,
    };

    await this.systemInfoStorageService.saveMetric(metric);

    const warnings = await this.alertService.generateWarnings();
    this.setSystemOverloadStatus(warnings);

    if (warnings.length) {
      this.alertService.logWarnings(warnings);
    }
  }
}
