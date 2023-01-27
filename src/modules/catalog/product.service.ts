import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Between,
  Connection,
  DeleteResult,
  Equal,
  MoreThan,
  Repository,
} from 'typeorm';
import { ProductsQuery } from './classes/product-query.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './models/product.entity';

@Injectable()
export class ProductService {
  private productRepository: Repository<Product>;
  constructor(private connection: Connection) {
    this.productRepository = this.connection.getRepository(Product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      order: { id: 'DESC' },
      relations: ['category'],
    });
  }

  async findByCategory(
    categoryId: number,
    productsQuery: ProductsQuery,
  ): Promise<Product[]> {
    const conditions = [
      {
        category: Equal(categoryId),
      } as any,
    ];

    if (productsQuery.priceFrom === undefined && productsQuery.priceTo) {
      conditions[0].price = Between(0, productsQuery.priceTo);
    }

    if (!productsQuery.priceTo && productsQuery.priceFrom) {
      conditions[0].price = MoreThan(productsQuery.priceFrom);
    }

    if (productsQuery.priceFrom >= 0 && productsQuery.priceTo > 0) {
      conditions[0].price = Between(
        productsQuery.priceFrom,
        productsQuery.priceTo,
      );
    }

    const products = await this.productRepository.find({
      where: conditions,
      relations: ['category'],
    });

    return products;
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productRepository.findOneOrFail({
      where: {
        id: Equal(id),
      },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Such product does not exist');
    }

    return product;
  }

  async create(product: CreateProductDto): Promise<Product> {
    return this.productRepository.save({
      ...product,
    } as any);
  }

  async update(id: number, product: CreateProductDto): Promise<Product> {
    const toUpdate = await this.productRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!toUpdate) {
      throw new NotFoundException('Such product does not exist');
    }

    return this.productRepository.save({
      ...toUpdate,
      ...(product as any),
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    const toDelete = await this.productRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!toDelete) {
      throw new NotFoundException('Such product does not exist');
    }

    return await this.productRepository.delete(id);
  }
}
