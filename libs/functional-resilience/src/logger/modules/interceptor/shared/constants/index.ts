import { LoggerConfigTargetsBase } from '../../../../shared/_types/logger.types';

export const DEFAULT_TARGETS: LoggerConfigTargetsBase[] = [
  'url',
  'method',
  'statusCode',
] as const;
