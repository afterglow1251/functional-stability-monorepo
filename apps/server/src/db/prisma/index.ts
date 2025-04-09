// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from 'generated/prisma';

import { PrismaClient as OriginalPrismaClient } from '@prisma/client';
import { PrismaClient } from 'generated/prisma';

// export class PrismaService extends PrismaClient implements OnModuleInit {
//   async onModuleInit() {
//     await this.$connect();
//   }
// }
export const prisma: OriginalPrismaClient = new PrismaClient();
