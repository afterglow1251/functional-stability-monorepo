import { Global, Module } from '@nestjs/common';
import { mongooseProvider } from '.';

@Global()
@Module({
  providers: [mongooseProvider],
  exports: [mongooseProvider],
})
export class MongooseDatabaseModule {}
