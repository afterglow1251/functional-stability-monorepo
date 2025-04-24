import { ConnectionResult } from '../_types';
import { checkHealth } from './check-health';

export function createHealthChecker(
  fn: () => Promise<any>,
): () => Promise<ConnectionResult> {
  return () => checkHealth(fn);
}

export function createDbHealthChecker<T>(fn: (db: T) => Promise<any>) {
  return (db: T): Promise<ConnectionResult> => checkHealth(() => fn(db));
}
