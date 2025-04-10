import { Module } from '@nestjs/common';
import { postgresProvider } from '.';

@Module({
  providers: [postgresProvider],
  exports: [postgresProvider],
})
export class PostgresModule {}
