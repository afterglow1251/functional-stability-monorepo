import { DataSource, DataSourceOptions } from 'typeorm';

export let typeormDB: DataSource;

export const databaseProviders = [
  {
    provide: 'HEALTH_TYPEORM_PROVIDER',
    useFactory: async () => {
      typeormDB = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'my_db',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return typeormDB.initialize();
    },
  },
];
