import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { Category, Language, Product, Translation } from './models';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product, Language, Translation]),
  ],
  controllers: [
    CategoryController,
    ProductController,
    LanguageController,
    TranslationController,
  ],
  providers: [
    CategoryService,
    ProductService,
    LanguageService,
    TranslationService,
  ],
})
export class CatalogModule {}
