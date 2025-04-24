import { ConnectionResult } from '../_types';

export async function checkHealth(
  fn: () => Promise<any>,
): Promise<ConnectionResult> {
  try {
    await fn();
    return { ok: true, error: null };
  } catch (error) {
    return { ok: false, error };
  }
}
