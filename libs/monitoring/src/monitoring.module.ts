import { DynamicModule, Module } from '@nestjs/common';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { MONITORING_OPTIONS } from './shared/providers/monitoring.provider';
import { MonitoringModuleOptions } from './shared/_types/monitoring.types';
import { MonitoringCronService } from './monitoring-cron.service';

@Module({})
export class MonitoringModule {
  static forRoot(config: MonitoringModuleOptions): DynamicModule {
    const providers = [
      {
        provide: MONITORING_OPTIONS,
        useValue: config,
      },
      MonitoringService,
      ...(config.console.on || config.file.on ? [MonitoringCronService] : []),
    ];

    return {
      module: MonitoringModule,
      controllers: [MonitoringController],
      providers,
      exports: [MonitoringService],
    };
  }
}
