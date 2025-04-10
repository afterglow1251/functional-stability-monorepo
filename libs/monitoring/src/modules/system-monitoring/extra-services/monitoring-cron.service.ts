import {
  Inject,
  Injectable,
  Logger as NestLogger,
  OnModuleInit,
  Optional,
} from '@nestjs/common';
import { SystemMonitoringService } from '../monitoring.service';
import { MONITORING_OPTIONS } from '../shared/providers/monitoring.provider';
import { PinoFileLoggerService } from 'libs/shared/src';
import { MonitoringModuleOptions } from '../shared/_types/monitoring.types';
import { RequestLimitService } from './request-limit.service';
import * as cron from 'node-cron';

export const DEFAULT_MONITORING_THRESHOLDS = {
  cpu: 90,
  memory: 90,
  disk: 90,
  processCpu: 90,
  processMem: 90,
} as const;

@Injectable()
export class MonitoringCronService implements OnModuleInit {
  private readonly consoleLogger = new NestLogger(MonitoringCronService.name);
  private fileLogger?: PinoFileLoggerService;

  private readonly thresholds: {
    cpu: number;
    memory: number;
    disk: number;
    processCpu: number;
    processMem: number;
  };

  constructor(
    @Inject(MONITORING_OPTIONS)
    private readonly config: MonitoringModuleOptions,
    private readonly monitoringService: SystemMonitoringService,
    @Optional() private readonly requestLimitService?: RequestLimitService,
  ) {
    if (this.config.file.on) {
      this.fileLogger = new PinoFileLoggerService(config.file.options);
    }

    this.thresholds = {
      cpu: this.config.cpuThreshold ?? DEFAULT_MONITORING_THRESHOLDS.cpu,
      memory: this.config.memoryThreshold ?? DEFAULT_MONITORING_THRESHOLDS.memory,
      disk: this.config.diskThreshold ?? DEFAULT_MONITORING_THRESHOLDS.disk,
      processCpu:
        this.config.processCpuThreshold ?? DEFAULT_MONITORING_THRESHOLDS.processCpu,
      processMem:
        this.config.processMemThreshold ?? DEFAULT_MONITORING_THRESHOLDS.processMem,
    };
  }

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
      const {
        cpu: { currentLoad },
        memory: { used, total },
        disk,
        processLoad,
      } = await this.monitoringService.getAllSystemInfo();

      const warnings: string[] = [];

      if (currentLoad > this.thresholds.cpu) {
        warnings.push(`Warning: High CPU load detected: ${currentLoad.toFixed(2)}%`);
      }

      const memoryUsage = (used / total) * 100;
      if (memoryUsage > this.thresholds.memory) {
        warnings.push(
          `Warning: High memory usage detected: ${memoryUsage.toFixed(2)}%`,
        );
      }

      disk.forEach((disk) => {
        if (disk.use > this.thresholds.disk) {
          warnings.push(
            `Warning: High disk usage detected on ${disk.fs}: ${disk.use.toFixed(2)}%`,
          );
        }
      });

      processLoad.forEach((process) => {
        if (process.cpu > this.thresholds.processCpu) {
          warnings.push(
            `Warning: High CPU usage detected for process ${process.proc} (PID: ${process.pid}): ${process.cpu.toFixed(2)}%`,
          );
        }

        if (process.mem > this.thresholds.processMem) {
          warnings.push(
            `Warning: High memory usage detected for process ${process.proc} (PID: ${process.pid}): ${process.mem.toFixed(2)}%`,
          );
        }
      });

      if (warnings.length) {
        const warningsString = warnings.join('\n');
        if (this.config.console.on) this.consoleLogger.warn(warningsString);
        if (this.config.file.on) this.fileLogger!.warn(warningsString);
      }

      if (this.requestLimitService) {
        this.requestLimitService.setSystemOverloadStatus(warnings.length > 0);
      }
    });
  }
}
