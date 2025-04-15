import { Global, Module } from '@nestjs/common';
import { drizzleProvider } from '.';

@Global()
@Module({
  providers: [drizzleProvider],
  exports: [drizzleProvider],
})
export class DrizzleModule {}
