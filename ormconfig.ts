import 'dotenv/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST } = process.env;

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: DB_HOST,
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  port: 3306,
  autoLoadEntities: true,
  logging: true,
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/modules/**/db/migrations/*{.ts,.js}'],
  migrationsRun: false,
};

module.exports = typeOrmConfig;
