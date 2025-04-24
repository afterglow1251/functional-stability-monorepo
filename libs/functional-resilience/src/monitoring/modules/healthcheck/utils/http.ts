import { ConnectionResult } from '../_types';
import { checkHealth } from '../core/check-health';

export async function checkHttpHealth(apiUrl: string): Promise<ConnectionResult> {
  return checkHealth(async () => {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
  });
}
