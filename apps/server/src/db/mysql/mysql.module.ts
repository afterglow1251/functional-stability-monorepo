import { Module } from '@nestjs/common';
import { mysqlProvider } from '.';

@Module({
  providers: [mysqlProvider],
  exports: [mysqlProvider],
})
export class MysqlModule {}
