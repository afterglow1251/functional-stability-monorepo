import { DynamicModule, Module } from '@nestjs/common';
import { SystemMonitoringService } from './monitoring.service';
import { MonitoringCronService } from './sys-extra-services/monitoring-cron.service';
import { SystemMonitoringController } from './monitoring.controller';
import { SYSTEM_MONITORING_CONFIG } from './shared/provider-tokens/monitoring.provider';
import { MonitoringModuleConfig } from './shared/_types/monitoring.types';
import { SystemMonitoringAlertService } from './sys-extra-services/alert.service';
import { SystemInfoStorageService } from './sys-extra-services/storage/system-info-storage.service';

@Module({})
export class SystemMonitoringModule {
  static forRoot(config: MonitoringModuleConfig): DynamicModule {
    const providers = [
      {
        provide: SYSTEM_MONITORING_CONFIG,
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
