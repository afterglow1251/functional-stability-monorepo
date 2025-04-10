import { HEALTH_POSTGRES_PROVIDER } from '@app/monitoring';
import { Pool } from 'pg';

export const postgresProvider = {
  provide: HEALTH_POSTGRES_PROVIDER,
  useFactory: async () => {
    const pool = new Pool({
      host: 'localhost',
      user: 'postgres',
      password: 'root',
      database: 'my_db',
      port: 5432,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    return pool;
  },
};
