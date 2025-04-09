import { LoggerConfigTargetsBase } from '../_types/logger.types';

export const DEFAULT_TARGETS: LoggerConfigTargetsBase[] = [
  'url',
  'method',
  'statusCode',
] as const;
