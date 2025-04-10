import {
  Controller,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import {
  HEALTH_DRIZZLE_PROVIDER,
  HEALTH_MIKROORM_PROVIDER,
  HEALTH_MONGOOSE_PROVIDER,
  HEALTH_MYSQL_PROVIDER,
  HEALTH_POSTGRES_PROVIDER,
  HEALTH_PRISMA_PROVIDER,
  HEALTH_SEQUELIZE_PROVIDER,
  HEALTH_TYPEORM_PROVIDER,
} from './shared/providers';

@Controller('v1/healthcheck')
export class HealthcheckController {
  private readonly logger = new Logger(HealthcheckController.name);

  constructor(
    @Optional() @Inject(HEALTH_DRIZZLE_PROVIDER) private readonly drizzle: any,
    @Optional() @Inject(HEALTH_SEQUELIZE_PROVIDER) private readonly sequelize: any,
    @Optional() @Inject(HEALTH_MIKROORM_PROVIDER) private readonly mikroOrm: any,
    @Optional() @Inject(HEALTH_PRISMA_PROVIDER) private readonly prisma: any,
    @Optional() @Inject(HEALTH_TYPEORM_PROVIDER) private readonly typeOrm: any,
    @Optional() @Inject(HEALTH_MONGOOSE_PROVIDER) private readonly mongoose: any,
    @Optional() @Inject(HEALTH_POSTGRES_PROVIDER) private readonly postgres: any,
    @Optional() @Inject(HEALTH_MYSQL_PROVIDER) private readonly mysql: any,
  ) {}

  private checkDbConfigured(db: any) {
    if (!db) {
      throw new NotFoundException('Database not configured');
    }
  }

  async checkDbHealth(fn: () => Promise<any>) {
    try {
      await fn();
      return { status: 'OK', message: 'Database is up and running' };
    } catch (error) {
      this.logger.error('Health check failed:', error.stack);
      return { status: 'ERROR', message: 'Database is down', error: error.message };
    }
  }

  @Get('check_drizzle')
  async checkDrizzle() {
    this.checkDbConfigured(this.drizzle);

    return this.checkDbHealth(() => this.drizzle.execute('SELECT 1'));
  }

  @Get('check_typeorm')
  async checkTypeOrm() {
    this.checkDbConfigured(this.typeOrm);

    return this.checkDbHealth(() => this.typeOrm.query('SELECT 1'));
  }

  @Get('check_sequelize')
  async checkSequelizeOrm() {
    this.checkDbConfigured(this.sequelize);

    return this.checkDbHealth(() => this.sequelize.query('SELECT 1'));
  }

  @Get('check_mikroorm')
  async checkMikroOrm() {
    this.checkDbConfigured(this.mikroOrm);

    return this.checkDbHealth(() => this.mikroOrm.em.getKnex().raw('SELECT 1'));
  }

  @Get('check_prisma')
  async checkPrisma() {
    this.checkDbConfigured(this.prisma);

    return this.checkDbHealth(() => this.prisma.$queryRaw`SELECT 1`);
  }

  @Get('check_mongoose')
  async checkMongoose() {
    this.checkDbConfigured(this.mongoose);

    return this.checkDbHealth(() => {
      if (this.mongoose.readyState !== 1 || !this.mongoose.db) {
        throw new Error('MongoDB is not available');
      }

      return this.mongoose.db.command({ ping: 1 });
    });
  }

  @Get('check_mysql')
  async checkMysql() {
    this.checkDbConfigured(this.mysql);

    return this.checkDbHealth(() => this.mysql.query('SELECT 1'));
  }

  @Get('check_postgres')
  async checkPostgres() {
    this.checkDbConfigured(this.postgres);

    return this.checkDbHealth(() => this.postgres.query('SELECT 1'));
  }
}
