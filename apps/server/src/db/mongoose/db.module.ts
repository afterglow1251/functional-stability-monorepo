import { Global, Module } from '@nestjs/common';
import { mongooseProvider } from '.';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from './schema';

@Module({
  providers: [mongooseProvider],
  exports: [mongooseProvider],
})
export class MongooseDatabaseModule {}
