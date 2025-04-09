import { drizzle, MySqlDatabase } from 'drizzle-orm/mysql2';
import * as schema from './schema';

export const drizzleOrm: MySqlDatabase<any, any, typeof schema> = drizzle(
  'mysql://root:root@localhost/my_db',
);
