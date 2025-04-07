export type LoggerConfigTargetsBase =
  | 'method'
  | 'url'
  | 'statusCode'
  | 'ip'
  | 'headers'
  | 'query'
  | 'body'
  | 'duration';

export type LoggerConsoleConfigTargets = LoggerConfigTargetsBase;
export type LoggerFileConfigTargets = LoggerConfigTargetsBase;

export type LoggerConfigInitial = {
  console: LoggerConsoleConfig;
  file: LoggerFileConfig;
};

export type LoggerConsoleConfig = {
  on: boolean;
  targets?: LoggerConsoleConfigTargets[];
};

export type LoggerFileConfig = {
  on: boolean;
  options?: LoggerFileOptions;
  targets?: LoggerFileConfigTargets[];
};

export type LoggerFileOptions = {
  dir?: string;
  fileName?: string;
  frequency?: 'daily' | 'hourly' | number;
  mkdir?: boolean;
  dateFormat?: string;
};

export type LoggerConfig = {
  console: {
    on: boolean;
    targets: LoggerConsoleConfigTargets[];
  };
  file: {
    on: boolean;
    options?: LoggerFileOptions;
    targets: LoggerFileConfigTargets[];
  };
};

export type ExceptionFilterConfig = {
  console: { on: boolean };
  file: {
    on: boolean;
    options?: LoggerFileOptions;
  };
};
