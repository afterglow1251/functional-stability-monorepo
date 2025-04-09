import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './apps/server/src/db/drizzle/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    url: 'mysql://root:root@localhost/my_db',
  },
});
