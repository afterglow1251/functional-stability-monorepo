import {
  Inject,
  Injectable,
  Logger as NestLogger,
  OnModuleInit,
} from '@nestjs/common';
import * as cron from 'node-cron';
import { MONITORING_OPTIONS } from './shared/providers/monitoring.provider';
import { MonitoringService } from './monitoring.service';
import { MonitoringModuleOptions } from './shared/_types/monitoring.types';
import { PinoFileLoggerService } from 'libs/shared/src';

@Injectable()
export class MonitoringCronService implements OnModuleInit {
  private readonly consoleLogger = new NestLogger(MonitoringCronService.name);
  private fileLogger: PinoFileLoggerService;

  private isConsoleOn: boolean;
  private isFileOn: boolean;

  private cpuThreshold: number;
  private memoryThreshold: number;
  private diskThreshold: number;
  private processCpuThreshold: number;
  private processMemThreshold: number;

  constructor(
    @Inject(MONITORING_OPTIONS)
    private readonly config: MonitoringModuleOptions,
    private readonly monitoringService: MonitoringService,
  ) {
    this.fileLogger = new PinoFileLoggerService(config.file.options);

    this.isConsoleOn = config.console.on;
    this.isFileOn = config.file.on;

    this.cpuThreshold = this.config.cpuThreshold ?? 80;
    this.memoryThreshold = this.config.memoryThreshold ?? 85;
    this.diskThreshold = this.config.diskThreshold ?? 90;
    this.processCpuThreshold = this.config.processCpuThreshold ?? 80;
    this.processMemThreshold = this.config.processMemThreshold ?? 85;
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
      const data = await this.monitoringService.getAllSystemInfo();

      const {
        cpu: { currentLoad },
        memory: { used, total },
        disk,
        processLoad,
      } = data;

      const resultWarn: string[] = [];
      if (currentLoad > this.cpuThreshold) {
        resultWarn.push(
          `Warning: High CPU load detected: ${currentLoad.toFixed(2)}%`,
        );
      }

      const memoryUsage = (used / total) * 100;
      if (memoryUsage > this.memoryThreshold) {
        resultWarn.push(
          `Warning: High memory usage detected: ${memoryUsage.toFixed(2)}%`,
        );
      }

      disk.forEach((disk) => {
        if (disk.use > this.diskThreshold) {
          resultWarn.push(
            `Warning: High disk usage detected on ${disk.fs}: ${disk.use.toFixed(2)}%`,
          );
        }
      });

      processLoad.forEach((process) => {
        if (process.cpu > this.processCpuThreshold) {
          resultWarn.push(
            `Warning: High CPU usage detected for process ${process.proc} (PID: ${process.pid}): ${process.cpu.toFixed(2)}%`,
          );
        }

        if (process.mem > this.processMemThreshold) {
          resultWarn.push(
            `Warning: High memory usage detected for process ${process.proc} (PID: ${process.pid}): ${process.mem.toFixed(2)}%`,
          );
        }
      });

      if (resultWarn.length) {
        const warnStr = resultWarn.join('\n');
        if (this.isConsoleOn) this.consoleLogger.warn(warnStr);
        if (this.isFileOn) this.fileLogger.warn(warnStr);
      }
    });
  }
}
