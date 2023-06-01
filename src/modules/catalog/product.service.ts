import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Between,
  Connection,
  DeleteResult,
  Equal,
  Like,
  MoreThan,
  Repository,
} from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './models/product.entity';
import { IProductFilterQuery } from './filters';
import { IPaginationResponse } from '../shared/interfaces';

@Injectable()
export class ProductService {
  private productRepository: Repository<Product>;
  constructor(private connection: Connection) {
    this.productRepository = this.connection.getRepository(Product);
  }

  async findAll(query: IProductFilterQuery): Promise<IPaginationResponse<Product>> {
    const skip = query?.skip ? +query?.skip : 0;
    const take = query?.limit ? +query?.limit : 2;
    const code = query?.code ? +query?.code : undefined;
    const conditions = [];

    if (code) {
      conditions.push(
        {
          code: Like(`%${code}%`),
        } as any
      );
    }

    const products = await this.productRepository.find({
      order: { id: 'DESC' },
      relations: ['category'],
      where: conditions.length ? conditions : undefined,
      take,
      skip,
    });

    return {
      data: products,
      skip: skip,
      limit: take,
      totalLength: (await this.productRepository.find({ where: conditions.length ? conditions : undefined })).length
    };
  }

  async findByCategory(
    categoryId: number,
    query: IProductFilterQuery,
  ): Promise<IPaginationResponse<Product>> {
    const skip = query?.skip ? +query?.skip : 0;
    const take = query?.limit ? +query?.limit : 2;
    const code = query?.code ? +query?.limit : undefined;
    const conditions = [
      {
        category: Equal(categoryId),
      } as any,
    ];

    if (code) {
      conditions.push(
        {
          code: Like(`%${code}%`),
        } as any
      );
    }

    if (query.priceFrom === undefined && query.priceTo) {
      conditions[0].price = Between(0, query.priceTo);
    }

    if (!query.priceTo && query.priceFrom) {
      conditions[0].price = MoreThan(query.priceFrom);
    }

    if (query.priceFrom >= 0 && query.priceTo > 0) {
      conditions[0].price = Between(
        query.priceFrom,
        query.priceTo,
      );
    }

    const products = await this.productRepository.find({
      where: conditions,
      relations: ['category'],
      take,
      skip,
    });

    return {
      data: products,
      skip: skip,
      limit: take,
      totalLength: (await this.productRepository.find({ where: conditions })).length
    };
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
