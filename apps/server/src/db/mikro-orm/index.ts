import { MikroORM } from '@mikro-orm/core';
import { User } from './user.entity';
import { MySqlDriver } from '@mikro-orm/mysql';

export const mikroOrmProvider = {
  provide: 'MikroORM',
  useFactory: async (): Promise<MikroORM<MySqlDriver>> => {
    const orm = await MikroORM.init({
      entities: [User],
      entitiesTs: [User],
      dbName: 'my_db',
      driver: MySqlDriver,
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
    });

    console.log('MikroORM initialized:');

    return orm;
  },
};

export const mikroOrmStringProvider = {
  provide: 'HEALTH_MIKROORM_PROVIDER',
  useExisting: 'MikroORM',
};
