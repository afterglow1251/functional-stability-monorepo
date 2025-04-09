import {
  Controller,
  Get,
  Inject,
  Logger,
  Res,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ServerService } from './server.service';
import { CatchHttpExceptionFilter } from '@app/logger';
import { LoggerInterceptor } from '@app/logger/modules/interceptor/logger.interceptor';
import { drizzleOrm } from './db/drizzle';
import { usersTable } from './db/drizzle/schema';
import { typeormDB } from './db/typeorm/db.providers';
import { sequelizeDB } from './db/sequelize/db.providers';
import { mikroOrm } from './db/mikro-orm/index';
import { PrismaClient } from 'generated/prisma';
import { mysqlClient } from './db/mysql';
import { postgresClient } from './db/postgres';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { prisma } from './db/prisma';
import { MONGOOSE_CONNECTION } from './db/mongoose';

@Controller()
export class ServerController {
  private readonly logger = new Logger(ServerController.name);

  constructor(
    private readonly serverService: ServerService,
    @Inject(MONGOOSE_CONNECTION) private mongooseConnection: Connection,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    this.logger.log('GET hello controller');
    return await this.serverService.getHello();
  }

  @Get('test')
  // @UseInterceptors(LoggerInterceptor)
  getTest(): any {
    return { message: 'test' };
  }

  @Get('error')
  // @UseFilters(CatchHttpExceptionFilter)
  getError(): string {
    return this.serverService.getError();
  }

  @Get('d_users')
  getUsers() {
    return drizzleOrm.select().from(usersTable);
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

  // @Get('check_drizzle')
  // async checkDrizzle() {
  //   return this.checkDbHealth(() => drizzleOrm.execute('SELECT 1'));
  // }

  // @Get('check_typeorm')
  // async checkTypeOrm() {
  //   return this.checkDbHealth(() => typeormDB.query('SELECT 1'));
  // }

  // @Get('check_sequelize')
  // async checkSequelizeOrm() {
  //   return this.checkDbHealth(() => sequelizeDB.query('SELECT 1'));
  // }

  // @Get('check_mikroorm')
  // async checkMikroOrm() {
  //   const knex = mikroOrm.em.getKnex();
  //   return this.checkDbHealth(() => knex.raw('SELECT 1'));
  // }

  // @Get('check_prisma')
  // async checkPrisma() {
  //   return this.checkDbHealth(() => prisma.$queryRaw`SELECT 1`);
  // }

  // @Get('check_mysql')
  // async checkMysql() {
  //   return this.checkDbHealth(() => mysqlClient.query('SELECT 1'));
  // }

  // @Get('check_postgres')
  // async checkPostgres() {
  //   return this.checkDbHealth(() => postgresClient.query('SELECT 1'));
  // }

  @Get('check_mongoose')
  async checkMongoose() {
    return this.checkDbHealth(() => {
      if (this.mongooseConnection.readyState !== 1 || !this.mongooseConnection.db) {
        throw new Error('MongoDB is not available');
      }

      return this.mongooseConnection.db.command({ ping: 1 });
    });
  }
}
