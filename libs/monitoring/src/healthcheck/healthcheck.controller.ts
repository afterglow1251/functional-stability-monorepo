import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { MONGOOSE_CONNECTION } from 'apps/server/src/db/mongoose';

@Controller('healthcheck')
export class HealthcheckController {
  private readonly logger = new Logger(HealthcheckController.name);

  constructor(@Inject(MONGOOSE_CONNECTION) private readonly mongoose: any) {}

  async checkDbHealth(fn: () => Promise<any>) {
    try {
      await fn();
      return { status: 'OK', message: 'Database is up and running' };
    } catch (error) {
      this.logger.error('Health check failed:', error.stack);
      return { status: 'ERROR', message: 'Database is down', error: error.message };
    }
  }

  // @Get('check_drizzle')
  // async checkDrizzle() {
  //   return this.checkDbHealth(() => drizzle.execute('SELECT 1'));
  // }

  // @Get('check_typeorm')
  // async checkTypeOrm() {
  //   return this.checkDbHealth(() => typeorm.query('SELECT 1'));
  // }

  // @Get('check_sequelize')
  // async checkSequelizeOrm() {
  //   return this.checkDbHealth(() => sequelize.query('SELECT 1'));
  // }

  // @Get('check_mikroorm')
  // async checkMikroOrm() {
  //   return this.checkDbHealth(() => mikroORM.em.getKnex().raw('SELECT 1'));
  // }

  // @Get('check_prisma')
  // async checkPrisma() {
  //   return this.checkDbHealth(() => prisma.$queryRaw`SELECT 1`);
  // }

  @Get('check_mongoose')
  async checkMongoose() {
    return this.checkDbHealth(() => {
      if (this.mongoose.readyState !== 1 || !this.mongoose.db) {
        throw new Error('MongoDB is not available');
      }

      return this.mongoose.db.command({ ping: 1 });
    });
  }

  // @Get('check_mysql')
  // async checkMysql() {
  //   return this.checkDbHealth(() => mysqlPool.query('SELECT 1'));
  // }

  // @Get('check_postgres')
  // async checkPostgres() {
  //   return this.checkDbHealth(() => pgPool.query('SELECT 1'));
  // }
}

// import { Controller, Get, Inject, Logger } from '@nestjs/common';
// import { HEALTHCHECK_CONFIG } from './shared/constants';
// import { HealthcheckDbConfig } from './shared/_types';

// @Controller('healthcheck')
// export class HealthcheckController {
//   private readonly logger = new Logger(HealthcheckController.name);

//   constructor(
//     @Inject(HEALTHCHECK_CONFIG)
//     private readonly config: HealthcheckDbConfig,
//   ) {}

//   private async checkDbHealth(fn: () => Promise<any>) {
//     try {
//       await fn();
//       return { status: 'OK', message: 'Database is up and running' };
//     } catch (error) {
//       this.logger.error('Health check failed:', error.stack);
//       return {
//         status: 'ERROR',
//         message: 'Database is down',
//         error: error.message,
//       };
//     }
//   }

//   @Get()
//   async checkAll() {
//     const results: any = [];

//     if (this.config.drizzle) {
//       results.push({
//         db: 'drizzle',
//         ...(await this.checkDbHealth(() =>
//           this.config.drizzle!.execute('SELECT 1'),
//         )),
//       });
//     }

//     if (this.config.typeorm) {
//       results.push({
//         db: 'typeorm',
//         ...(await this.checkDbHealth(() => this.config.typeorm!.query('SELECT 1'))),
//       });
//     }

//     if (this.config.sequelize) {
//       results.push({
//         db: 'sequelize',
//         ...(await this.checkDbHealth(() =>
//           this.config.sequelize!.query('SELECT 1'),
//         )),
//       });
//     }

//     if (this.config.mikroOrm) {
//       const knex = this.config.mikroOrm.em.getKnex();
//       results.push({
//         db: 'mikroOrm',
//         ...(await this.checkDbHealth(() => knex.raw('SELECT 1'))),
//       });
//     }

//     if (this.config.prisma) {
//       results.push({
//         db: 'prisma',
//         ...(await this.checkDbHealth(() => this.config.prisma!.$queryRaw`SELECT 1`)),
//       });
//     }

//     if (this.config.mongoose) {
//       results.push({
//         db: 'mongoose',
//         ...(await this.checkDbHealth(() => {
//           if (this.config.mongoose!.readyState !== 1 || !this.config.mongoose!.db) {
//             throw new Error('MongoDB is not available');
//           }
//           return this.config.mongoose!.db.command({ ping: 1 });
//         })),
//       });
//     }

//     if (this.config.mysql) {
//       results.push({
//         db: 'mysql',
//         ...(await this.checkDbHealth(() => this.config.mysql!.query('SELECT 1'))),
//       });
//     }

//     if (this.config.postgres) {
//       results.push({
//         db: 'postgres',
//         ...(await this.checkDbHealth(() => this.config.postgres!.query('SELECT 1'))),
//       });
//     }

//     return results;
//   }
// }
