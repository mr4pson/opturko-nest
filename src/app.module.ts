import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as typeOrmConfig from 'ormconfig';
import { CatalogModule } from './modules/catalog/catalog.module';
import { AuthModule } from './modules/auth/auth.module';
import { AttachmentModule } from './modules/attachment/attachment.module';

const featureModules = [AuthModule, CatalogModule, AttachmentModule];

@Module({
  imports: [
    ...featureModules,
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
