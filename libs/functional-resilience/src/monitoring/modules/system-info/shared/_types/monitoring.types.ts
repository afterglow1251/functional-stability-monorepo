export type MonitoringModuleConfig = {
  cronExpression: string;

  console: { on: boolean };
  file: {
    on: boolean;
    options?: LoggerFileOptions;
  };

  thresholds?: {
    cpu?: number;
    memory?: number;
    disk?: number;
    processCpu?: number;
    processMemory?: number;
  };
};

export type LoggerFileOptions = {
  dir?: string;
  fileName?: string;
  frequency?: 'daily' | 'hourly' | number;
  mkdir?: boolean;
  dateFormat?: string;
};
