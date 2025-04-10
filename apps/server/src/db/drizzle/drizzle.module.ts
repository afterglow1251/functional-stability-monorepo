import { Module } from '@nestjs/common';
import { drizzleProvider } from '.';

@Module({
  providers: [drizzleProvider],
  exports: [drizzleProvider],
})
export class DrizzleModule {}
