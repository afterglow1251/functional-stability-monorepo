export type MonitoringModuleOptions = {
  cronExpression: string;
  console: { on: boolean };
  file: {
    on: boolean;
    options?: LoggerFileOptions;
  };
};

export type LoggerFileOptions = {
  dir?: string;
  fileName?: string;
  frequency?: 'daily' | 'hourly' | number;
  mkdir?: boolean;
  dateFormat?: string;
};
