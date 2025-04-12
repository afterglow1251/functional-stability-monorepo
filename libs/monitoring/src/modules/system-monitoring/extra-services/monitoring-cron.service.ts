import {
  Inject,
  Injectable,
  Logger as NestLogger,
  OnModuleInit,
} from '@nestjs/common';
import { SystemMonitoringService } from '../monitoring.service';
import { MONITORING_OPTIONS } from '../shared/providers/monitoring.provider';
import { MonitoringModuleOptions } from '../shared/_types/monitoring.types';
import * as cron from 'node-cron';
import { SystemMonitoringAlertService } from './alert.service';

@Injectable()
export class MonitoringCronService implements OnModuleInit {
  private readonly consoleLogger = new NestLogger(MonitoringCronService.name);

  private isSystemOverloaded: boolean = false;
  private systemMetrics: any;

  constructor(
    @Inject(MONITORING_OPTIONS)
    private readonly config: MonitoringModuleOptions,
    private readonly monitoringService: SystemMonitoringService,
    private readonly alertService: SystemMonitoringAlertService,
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

  getSystemMetrics() {
    return this.systemMetrics;
  }

  private setSystemOverloadStatus(warnings: string[]) {
    this.isSystemOverloaded = warnings.length > 0;
  }

  getIsSystemOverloaded(): boolean {
    return this.isSystemOverloaded;
  }

  async updateSystemMetrics() {
    const {
      cpu: { currentLoad },
      memory: { used, total },
      disk,
      processLoad,
    } = await this.monitoringService.getAllSystemInfo();

    this.systemMetrics = {
      cpu: currentLoad,
      memory: { used, total },
      disk,
      processLoad,
    };

    const warnings = this.alertService.generateWarnings(this.systemMetrics);
    this.setSystemOverloadStatus(warnings);

    this.alertService.logWarnings(warnings);
  }
}
