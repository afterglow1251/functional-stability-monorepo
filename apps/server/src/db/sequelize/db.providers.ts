import { Sequelize } from 'sequelize-typescript';
import { User } from './schema';

export let sequelizeDB: Sequelize;

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
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
