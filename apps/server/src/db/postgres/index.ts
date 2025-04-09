import { Pool } from 'pg';

export const postgresClient: Pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'root',
  database: 'my_db',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
