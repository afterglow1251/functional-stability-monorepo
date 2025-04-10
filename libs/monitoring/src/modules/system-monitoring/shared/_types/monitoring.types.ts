export type MonitoringModuleOptions = {
  cronExpression: string;

  console: { on: boolean };
  file: {
    on: boolean;
    options?: LoggerFileOptions;
  };

  cpuThreshold?: number;
  memoryThreshold?: number;
  diskThreshold?: number;
  processCpuThreshold?: number;
  processMemThreshold?: number;
};

export type LoggerFileOptions = {
  dir?: string;
  fileName?: string;
  frequency?: 'daily' | 'hourly' | number;
  mkdir?: boolean;
  dateFormat?: string;
};
