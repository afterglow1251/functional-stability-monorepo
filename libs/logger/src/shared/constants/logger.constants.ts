import { LoggerConfigTargetsBase } from '../_types/logger.types';

export const DEFAULT_TARGETS: LoggerConfigTargetsBase[] = [
  'url',
  'method',
  'statusCode',
] as const;

export const DEFAULT_FILE_CONFIG = {
  dir: './logs',
  fileName: 'app.log',
  frequency: 'hourly',
  mkdir: true,
  dateFormat: 'yyyy-MM-dd-HH-mm-ss',
} as const;
