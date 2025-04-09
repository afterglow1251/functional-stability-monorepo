export interface HealthcheckDbConfig {
  drizzle?: { execute: (sql: string) => Promise<any> };
  typeorm?: { query: (sql: string) => Promise<any> };
  sequelize?: { query: (sql: string) => Promise<any> };
  mikroOrm?: { em: { getKnex: () => { raw: (sql: string) => Promise<any> } } };
  prisma?: { $queryRaw: any };
  mongoose?: { readyState: number; db?: { command: (cmd: any) => Promise<any> } };
  mysql?: { query: (sql: string) => Promise<any> };
  postgres?: { query: (sql: string) => Promise<any> };
}
