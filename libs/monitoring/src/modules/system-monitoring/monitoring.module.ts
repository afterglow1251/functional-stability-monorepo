import { DynamicModule, Module } from '@nestjs/common';
import { SystemMonitoringService } from './monitoring.service';
import { MonitoringCronService } from './extra-services/monitoring-cron.service';
import { SystemMonitoringController } from './monitoring.controller';
// import { RequestLimitService } from './extra-services/request-limit.service';
import { MONITORING_OPTIONS } from './shared/providers/monitoring.provider';
import { MonitoringModuleOptions } from './shared/_types/monitoring.types';
import { SystemMonitoringAlertService } from './extra-services/alert.service';
import { MetricsStorageService } from './metrics-storage.service';

@Module({})
export class SystemMonitoringModule {
  static forRoot(config: MonitoringModuleOptions): DynamicModule {
    const isLoggingOn = config.console.on || config.file.on;
    const providers = [
      {
        provide: MONITORING_OPTIONS,
        useValue: config,
      },
      SystemMonitoringService,
      ...(isLoggingOn
        ? [
            MonitoringCronService,
            SystemMonitoringAlertService,
            MetricsStorageService,
          ]
        : []),
    ];

    return {
      module: SystemMonitoringModule,
      controllers: [SystemMonitoringController],
      providers,
      exports: [
        SystemMonitoringService,
        ...(isLoggingOn
          ? [
              MonitoringCronService,
              SystemMonitoringAlertService,
              MetricsStorageService,
            ]
          : []),
      ],
    };
  }
}
