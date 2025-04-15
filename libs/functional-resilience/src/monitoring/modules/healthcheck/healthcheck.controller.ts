import { drizzle } from 'drizzle-orm/mysql2';
import {
  Controller,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { DRIZZLE_PROVIDER_TOKEN } from './shared/provider-tokens';
// import {
//   HEALTH_DRIZZLE_PROVIDER,
//   HEALTH_MIKROORM_PROVIDER,
//   HEALTH_MONGOOSE_PROVIDER,
//   HEALTH_MYSQL_PROVIDER,
//   HEALTH_POSTGRES_PROVIDER,
//   HEALTH_PRISMA_PROVIDER,
//   HEALTH_SEQUELIZE_PROVIDER,
//   HEALTH_TYPEORM_PROVIDER,
// } from './shared/provider-tokens';

@Controller('v1/healthcheck')
export class HealthcheckController {
  private readonly logger = new Logger(HealthcheckController.name);

  constructor(
    @Optional() @Inject(DRIZZLE_PROVIDER_TOKEN) private readonly drizzle: any,
  ) {
    // @Optional() @Inject(HEALTH_DRIZZLE_PROVIDER) private readonly drizzle: any,
    // @Optional() @Inject(HEALTH_SEQUELIZE_PROVIDER) private readonly sequelize: any,
    // @Optional() @Inject(HEALTH_MIKROORM_PROVIDER) private readonly mikroOrm: any,
    // @Optional() @Inject(HEALTH_PRISMA_PROVIDER) private readonly prisma: any,
    // @Optional() @Inject(HEALTH_TYPEORM_PROVIDER) private readonly typeOrm: any,
    // @Optional() @Inject(HEALTH_MONGOOSE_PROVIDER) private readonly mongoose: any,
    // @Optional() @Inject(HEALTH_POSTGRES_PROVIDER) private readonly postgres: any,
    // @Optional() @Inject(HEALTH_MYSQL_PROVIDER) private readonly mysql: any,
  }

  // private checkDbConfigured(db: any) {
  //   if (!db) {
  //     throw new NotFoundException('Database not configured');
  //   }
  // }

  async checkDbHealth(checkFn: () => Promise<any>) {
    try {
      await checkFn();
      return { status: 'OK', message: 'Database is up and running' };
    } catch (error) {
      this.logger.error('Health check failed:', error.stack);
      return { status: 'ERROR', message: 'Database is down', error: error.message };
    }
  }

  @Get('check_drizzle')
  async checkDrizzle() {
    return this.checkDbHealth(() => this.drizzle.execute('SELECT 1'));
  }

  // @Get('drizzle')
  // async checkDrizzle() {
  //   this.checkDbConfigured(this.drizzle);

  //   return this.checkDbHealth(() => this.drizzle.execute('SELECT 1'));
  // }

  // @Get('typeorm')
  // async checkTypeOrm() {
  //   this.checkDbConfigured(this.typeOrm);

  //   return this.checkDbHealth(() => this.typeOrm.query('SELECT 1'));
  // }

  // @Get('sequelize')
  // async checkSequelizeOrm() {
  //   this.checkDbConfigured(this.sequelize);

  //   return this.checkDbHealth(() => this.sequelize.query('SELECT 1'));
  // }

  // @Get('mikroorm')
  // async checkMikroOrm() {
  //   this.checkDbConfigured(this.mikroOrm);

  //   return this.checkDbHealth(() => this.mikroOrm.em.getKnex().raw('SELECT 1'));
  // }

  // @Get('prisma')
  // async checkPrisma() {
  //   this.checkDbConfigured(this.prisma);

  //   return this.checkDbHealth(() => this.prisma.$queryRaw`SELECT 1`);
  // }

  // @Get('mongoose')
  // async checkMongoose() {
  //   this.checkDbConfigured(this.mongoose);

  //   return this.checkDbHealth(() => {
  //     if (this.mongoose.readyState !== 1 || !this.mongoose.db) {
  //       throw new Error('MongoDB is not available');
  //     }

  //     return this.mongoose.db.command({ ping: 1 });
  //   });
  // }

  // @Get('mysql')
  // async checkMysql() {
  //   this.checkDbConfigured(this.mysql);

  //   return this.checkDbHealth(() => this.mysql.query('SELECT 1'));
  // }

  // @Get('postgres')
  // async checkPostgres() {
  //   this.checkDbConfigured(this.postgres);

  //   return this.checkDbHealth(() => this.postgres.query('SELECT 1'));
  // }

  // @Get('all')
  // async checkAll() {
  //   const checks = await Promise.all(
  //     [
  //       this.drizzle &&
  //         this.createNamedCheck('drizzle', () => this.drizzle.execute('SELECT 1')),
  //       this.typeOrm &&
  //         this.createNamedCheck('typeorm', () => this.typeOrm.query('SELECT 1')),
  //       this.sequelize &&
  //         this.createNamedCheck('sequelize', () => this.sequelize.query('SELECT 1')),
  //       this.mikroOrm &&
  //         this.createNamedCheck('mikroorm', () =>
  //           this.mikroOrm.em.getKnex().raw('SELECT 1'),
  //         ),
  //       this.prisma &&
  //         this.createNamedCheck('prisma', () => this.prisma.$queryRaw`SELECT 1`),
  //       this.mongoose &&
  //         this.createNamedCheck('mongoose', () => {
  //           if (this.mongoose.readyState !== 1 || !this.mongoose.db) {
  //             throw new Error('MongoDB is not available');
  //           }
  //           return this.mongoose.db.command({ ping: 1 });
  //         }),
  //       this.mysql &&
  //         this.createNamedCheck('mysql', () => this.mysql.query('SELECT 1')),
  //       this.postgres &&
  //         this.createNamedCheck('postgres', () => this.postgres.query('SELECT 1')),
  //     ].filter(Boolean), // Remove all `undefined` if the database is not configured
  //   );

  //   const isAllOk = checks.every((check) => check.result.status === 'OK');

  //   return {
  //     status: isAllOk ? 'OK' : 'PARTIAL',
  //     databases: checks,
  //   };
  // }

  // private async createNamedCheck(name: string, checkFn: () => Promise<any>) {
  //   return {
  //     name,
  //     result: await this.checkDbHealth(checkFn),
  //   };
  // }
}
