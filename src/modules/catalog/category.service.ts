import { Injectable, NotFoundException } from '@nestjs/common';
import { Connection, DeleteResult, Equal, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Section } from './enums';
import { Category } from './models/category.entity';
import { Product } from './models';

@Injectable()
export class CategoryService {
  private categoryRepository: Repository<Category>;
  private productRepository: Repository<Product>;
  constructor(private connection: Connection) {
    this.categoryRepository = this.connection.getRepository(Category);
    this.productRepository = this.connection.getRepository(Product);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneOrFail({
      where: {
        id: Equal(id),
      },
    });

    if (!category) {
      throw new NotFoundException('Such category does not exist');
    }

    return category;
  }

  async findBySection(section: any): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      where: {
        section: Equal(section),
      },
    });

    return categories;
  }

  async create(category: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.save({
      ...category,
    } as any);
  }

  async update(id: number, category: CreateCategoryDto): Promise<Category> {
    const toUpdate = await this.categoryRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!toUpdate) {
      throw new NotFoundException('Such category does not exist');
    }

    return this.categoryRepository.save({
      ...toUpdate,
      ...category,
    });
  }

  async purge(categoryId: number): Promise<Product[]> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: Equal(categoryId),
      },
    });

    if (!category) {
      throw new NotFoundException('Such category does not exist');
    }

    const products = await this.productRepository.findBy({
      category: Equal(categoryId),
    });

    return await this.productRepository.remove(products);
  }

  async delete(id: number): Promise<DeleteResult> {
    const toDelete = await this.categoryRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!toDelete) {
      throw new NotFoundException('Such category does not exist');
    }

    return await this.categoryRepository.delete(id);
  }
}
