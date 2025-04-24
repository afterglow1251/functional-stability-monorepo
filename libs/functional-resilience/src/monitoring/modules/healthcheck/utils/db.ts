import { ConnectionResult } from '../_types';
import { checkHealth } from '../core/check-health';

export async function checkDrizzleHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.execute('SELECT 1'));
}

export async function checkMikroOrmHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.em.getKnex().raw('SELECT 1'));
}

export async function checkTypeOrmHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.query('SELECT 1'));
}

export async function checkSequelizeHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.query('SELECT 1'));
}

export async function checkPrismaHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.$queryRaw`SELECT 1`);
}

export async function checkMongooseHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.db.command({ ping: 1 }));
}

export async function checkMysqlHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.query('SELECT 1'));
}

export async function checkPostgresHealth(db: any): Promise<ConnectionResult> {
  return checkHealth(() => db.query('SELECT 1'));
}
