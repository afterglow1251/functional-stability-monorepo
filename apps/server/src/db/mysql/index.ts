import { createPool, Pool } from 'mysql2/promise';

export const mysqlProvider = {
  provide: 'HEALTH_MYSQL_PROVIDER',
  useFactory: async () => {
    const pool: Pool = createPool({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'my_db',
      waitForConnections: true,
      connectionLimit: 10,
    });
    return pool;
  },
};
