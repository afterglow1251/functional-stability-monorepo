import { Global, Module } from '@nestjs/common';
import { mongooseProvider } from '.';

@Module({
  providers: [mongooseProvider],
  exports: [mongooseProvider],
})
export class MongooseDatabaseModule {}
