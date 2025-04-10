// prisma.module.ts
import { Module } from '@nestjs/common';
import { prismaProvider } from '.';

@Module({
  providers: [prismaProvider],
  exports: [prismaProvider],
})
export class PrismaModule {}
