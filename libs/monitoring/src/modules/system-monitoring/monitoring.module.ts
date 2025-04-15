import { DynamicModule, Module } from '@nestjs/common';
import { SystemMonitoringService } from './monitoring.service';
import { MonitoringCronService } from './extra-services/monitoring-cron.service';
import { SystemMonitoringController } from './monitoring.controller';
import { MONITORING_OPTIONS } from './shared/providers/monitoring.provider';
import { MonitoringModuleOptions } from './shared/_types/monitoring.types';
import { SystemMonitoringAlertService } from './extra-services/alert.service';
import { SystemInfoStorageService } from './system-info.service';

@Module({})
export class SystemMonitoringModule {
  static forRoot(config: MonitoringModuleOptions): DynamicModule {
    const providers = [
      {
        provide: MONITORING_OPTIONS,
        useValue: config,
      },
      SystemMonitoringService,
      MonitoringCronService,
      SystemMonitoringAlertService,
      SystemInfoStorageService,
    ];

    return {
      module: SystemMonitoringModule,
      controllers: [SystemMonitoringController],
      providers,
      exports: [
        SystemMonitoringService,
        MonitoringCronService,
        SystemMonitoringAlertService,
        SystemInfoStorageService,
      ],
    };
  }
}
