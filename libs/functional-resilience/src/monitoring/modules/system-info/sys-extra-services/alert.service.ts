import { Inject, Injectable, Logger as NestLogger } from '@nestjs/common';
import { SYSTEM_MONITORING_CONFIG } from '../shared/provider-tokens/monitoring.provider';
import { MonitoringModuleConfig } from '../shared/_types/monitoring.types';
import { SystemInfoStorageService } from './storage/system-info-storage.service';
import { DEFAULT_MONITORING_THRESHOLDS } from '../shared/constants/monitoring-thresholds';
import { PinoFileLoggerService } from '../../../../shared/services/file-logger.service';

@Injectable()
export class SystemMonitoringAlertService {
  private readonly consoleLogger = new NestLogger(SystemMonitoringAlertService.name);
  private fileLogger?: PinoFileLoggerService;

  private readonly thresholds: {
    cpu: number;
    memory: number;
    disk: number;
    processCpu: number;
    processMem: number;
  };

  constructor(
    @Inject(SYSTEM_MONITORING_CONFIG)
    private readonly config: MonitoringModuleConfig,
    private readonly systemInfoStorageService: SystemInfoStorageService,
  ) {
    if (this.config.file.on) {
      this.fileLogger = new PinoFileLoggerService(config.file.options);
    }

    this.thresholds = {
      cpu: this.config.thresholds?.cpu ?? DEFAULT_MONITORING_THRESHOLDS.cpu,
      memory: this.config.thresholds?.memory ?? DEFAULT_MONITORING_THRESHOLDS.memory,
      disk: this.config.thresholds?.disk ?? DEFAULT_MONITORING_THRESHOLDS.disk,
      processCpu:
        this.config.thresholds?.processCpu ??
        DEFAULT_MONITORING_THRESHOLDS.processCpu,
      processMem:
        this.config.thresholds?.processMemory ??
        DEFAULT_MONITORING_THRESHOLDS.processMemory,
    };
  }

  async generateWarnings(): Promise<string[]> {
    const systemMetrics = await this.systemInfoStorageService.getLastRecord();

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
