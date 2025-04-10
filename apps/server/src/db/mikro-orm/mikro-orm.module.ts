import { Global, Module } from '@nestjs/common';
import { mikroOrmProvider, mikroOrmStringProvider } from '.';

@Module({
  providers: [mikroOrmProvider, mikroOrmStringProvider],
  exports: [mikroOrmProvider, mikroOrmStringProvider],
})
export class MikroOrmModuleDatabase {}
