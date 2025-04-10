import { drizzle, MySqlDatabase } from 'drizzle-orm/mysql2';
import * as schema from './schema';
import { HEALTH_DRIZZLE_PROVIDER } from '@app/monitoring';

export const drizzleProvider = {
  provide: HEALTH_DRIZZLE_PROVIDER,
  useFactory: () => {
    const db: MySqlDatabase<any, any, typeof schema> = drizzle(
      'mysql://root:root@localhost/my_db',
    );
    return db;
  },
};
