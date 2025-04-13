import { Inject, Injectable, Logger as NestLogger } from '@nestjs/common';
import { MONITORING_OPTIONS } from '../shared/providers/monitoring.provider';
import { MonitoringModuleOptions } from '../shared/_types/monitoring.types';
import { PinoFileLoggerService } from 'libs/shared/src';
import { MetricsStorageService } from '../metrics-storage.service';

export const DEFAULT_MONITORING_THRESHOLDS = {
  cpu: 95,
  memory: 95,
  disk: 95,
  processCpu: 95,
  processMem: 95,
} as const;

@Injectable()
export class SystemMonitoringAlertService {
  private readonly consoleLogger = new NestLogger(SystemMonitoringAlertService.name);
  private fileLogger?: PinoFileLoggerService;

  private readonly thresholds: {
    cpu: any;
    memory: any;
    disk: any;
    processCpu: any;
    processMem: any;
  };

  constructor(
    @Inject(MONITORING_OPTIONS)
    private readonly config: MonitoringModuleOptions,
    private readonly metricsStorageService: MetricsStorageService,
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

  async generateWarnings(): Promise<string[]> {
    const systemMetrics = await this.metricsStorageService.getLastRecord();

    if (!systemMetrics) return [];

    const warnings: string[] = [];

    const memoryUsage =
      (systemMetrics.memory.used / systemMetrics.memory.total) * 100;

    if (systemMetrics.cpu.currentLoad > this.thresholds.cpu) {
      warnings.push(
        `Warning: High CPU load detected: ${systemMetrics.cpu.currentLoad.toFixed(2)}%`,
      );
    }

    if (memoryUsage > this.thresholds.memory) {
      warnings.push(
        `Warning: High memory usage detected: ${memoryUsage.toFixed(2)}%`,
      );
    }

    systemMetrics.disk.forEach((d) => {
      if (d.use > this.thresholds.disk) {
        warnings.push(
          `Warning: High disk usage detected on ${d.fs} ${d.use.toFixed(2)}%`,
        );
      }
    });

    systemMetrics.processLoad.forEach((p) => {
      if (p.cpu > this.thresholds.processCpu) {
        warnings.push(
          `Warning: High CPU usage detected for process ${p.proc} (PID: ${p.pid}): ${p.cpu.toFixed(2)}%`,
        );
      }

      if (p.mem > this.thresholds.processMem) {
        warnings.push(
          `Warning: High memory usage detected for process ${p.proc} (PID: ${p.pid}): ${p.mem.toFixed(2)}%`,
        );
      }
    });

    return warnings;
  }

  logWarnings(warnings: string[]) {
    const warningsString = '\n' + warnings.join('\n');
    if (this.config.console.on) this.consoleLogger.warn(warningsString);
    if (this.config.file.on) this.fileLogger!.warn(warningsString);
  }
}
