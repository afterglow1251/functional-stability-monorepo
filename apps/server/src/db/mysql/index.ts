import { createPool, Pool } from 'mysql2/promise';

export const mysqlClient: Pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'my_db',
  waitForConnections: true,
  connectionLimit: 10,
});
