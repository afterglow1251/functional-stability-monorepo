import { Sequelize } from 'sequelize-typescript';
import { User } from './schema';
import { HEALTH_SEQUELIZE_PROVIDER } from '@app/monitoring';

export let sequelizeDB: Sequelize;

export const databaseProviders = [
  {
    provide: HEALTH_SEQUELIZE_PROVIDER,
    useFactory: async () => {
      sequelizeDB = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'my_db',
      });
      sequelizeDB.addModels([User]);
      await sequelizeDB.sync();
      return sequelizeDB;
    },
  },
];
