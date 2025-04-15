import { LoggerConfigTargetsBase } from '@app/logger';

export const DEFAULT_TARGETS: LoggerConfigTargetsBase[] = [
  'url',
  'method',
  'statusCode',
] as const;
