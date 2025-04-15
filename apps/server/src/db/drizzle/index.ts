import { drizzle, MySqlDatabase } from 'drizzle-orm/mysql2';
import * as schema from './schema';
export const drizzleProvideToken = Symbol('drizzleProviderToken');

export const drizzleProvider = {
  provide: drizzleProvideToken,
  useFactory: () => {
    const db: MySqlDatabase<any, any, typeof schema> = drizzle(
      'mysql://root:root@localhost/my_db',
    );
    return db;
  },
};
