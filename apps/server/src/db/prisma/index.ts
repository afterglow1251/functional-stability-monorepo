import { PrismaClient } from 'generated/prisma';
import { Provider } from '@nestjs/common';

export const prismaProvider: Provider = {
  provide: 'HEALTH_PRISMA_PROVIDER',
  useFactory: () => {
    const prisma = new PrismaClient();
    prisma.$connect();
    return prisma;
  },
};
