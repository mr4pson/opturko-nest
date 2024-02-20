import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Between,
  Connection,
  DeleteResult,
  Equal,
  In,
  Like,
  MoreThan,
  Not,
  Repository,
} from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './models/product.entity';
import { IProductFilterQuery } from './filters';
import { IPaginationResponse } from '../shared/interfaces';
import { UploadProductsDto } from './dto';
import * as fs from 'fs'
import { CsvParser } from 'nest-csv-parser'
import { Category } from './models';

@Injectable()
export class ProductService {
  private productRepository: Repository<Product>;
  private categoryRepository: Repository<Category>;
  constructor(private connection: Connection, private readonly csvParser: CsvParser) {
    this.productRepository = this.connection.getRepository(Product);
    this.categoryRepository = this.connection.getRepository(Category);
  }

  async findAll(query: IProductFilterQuery): Promise<IPaginationResponse<Product>> {
    const skip = query?.skip ? +query?.skip : 0;
    const take = query?.limit ? +query?.limit : 2;
    const code = query?.code ? +query?.code : undefined;
    const brand = query?.brand ?? undefined;
    const priceSort = query?.priceSort ?? undefined;
    const conditions: any = {};
  
    let order = { id: 'DESC' } as any;

    if (code) {
      conditions['code'] = Like(`%${code}%`);
    }

    if (brand) {
      conditions['brand'] =Like(`%${brand}%`);
    }

    if (priceSort) {
      order = {
        price: priceSort
      }
    }

    if (query.priceFrom === undefined && query.priceTo) {
      conditions.price = Between(0, query.priceTo);
    }

    if (!query.priceTo && query.priceFrom) {
      conditions.price = MoreThan(query.priceFrom);
    }

    if (query.priceFrom >= 0 && query.priceTo > 0) {
      conditions.price = Between(
        query.priceFrom,
        query.priceTo,
      );
    }

    const products = await this.productRepository.find({
      order,
      relations: ['category'],
      where: Object.keys(conditions).length ? [conditions] : undefined,
      take,
      skip,
    });

    return {
      data: products,
      skip: skip,
      limit: take,
      totalLength: (await this.productRepository.find({ where: Object.keys(conditions).length ? [conditions] : undefined })).length
    };
  }

  async findByCategory(
    categoryId: number,
    query: IProductFilterQuery,
  ): Promise<IPaginationResponse<Product>> {
    const skip = query?.skip ? +query?.skip : 0;
    const take = query?.limit ? +query?.limit : 2;
    const code = query?.code ? +query?.code : undefined;
    const brand = query?.brand ? query?.brand : undefined;
    const priceSort = query?.priceSort ?? undefined;
    const conditions: any = {
      category: Equal(categoryId),
    };
  
    let order = { id: 'DESC' } as any;

    if (code) {
      conditions['code'] = Like(`%${code}%`);
    }

    if (brand) {
      conditions['brand'] =Like(`%${brand}%`);
    }

    if (priceSort) {
      order = {
        price: priceSort
      }
    }

    if (query.priceFrom === undefined && query.priceTo) {
      conditions.price = Between(0, query.priceTo);
    }

    if (!query.priceTo && query.priceFrom) {
      conditions.price = MoreThan(query.priceFrom);
    }

    if (query.priceFrom >= 0 && query.priceTo > 0) {
      conditions.price = Between(
        query.priceFrom,
        query.priceTo,
      );
    }

    const products = await this.productRepository.find({
      order,
      relations: ['category'],
      where: Object.keys(conditions).length ? [conditions] : undefined,
      take,
      skip,
    });

    return {
      data: products,
      skip: skip,
      limit: take,
      totalLength: (await this.productRepository.find({ where: Object.keys(conditions).length ? [conditions] : undefined })).length
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

  async upload(payload: UploadProductsDto): Promise<Object[]> {
    const stream = fs.createReadStream(`upload/${payload.csvFile}`)
    const parsedCSV: any = await this.csvParser.parse(stream, Object);

    const formattedParsedProducts = parsedCSV.list.map(parsedProduct => ({
      ...parsedProduct,
      code: Number(parsedProduct.code),
      category: Number(parsedProduct.category),
      price: Number(parsedProduct.price),
      numberInPack: Number(parsedProduct.numberInPack),
    }));
    const parsedProductCodes = formattedParsedProducts.map(parsedProduct => (parsedProduct.code));
    const products = await this.productRepository.find({
      where: [{
        code: In(parsedProductCodes)
      }],
    });

    for (const product of products) {
      const curParsedProduct = formattedParsedProducts.find(parsedProduct => parsedProduct.code === product.code);
      const curImage = payload.images.find(image => image.originalFileName.split('.')[0] === product.code.toString());
      const productPayload = {
        ...product,
        ...curParsedProduct,
        image: curImage?.fileName ?? product.image,
      };

      await this.productRepository.save(productPayload);
    }

    const productCodes = products.map(product => product.code);
    const parsedProductsToCreate = formattedParsedProducts.filter(parsedProduct => !productCodes.find(productCode => parsedProduct.code === productCode));

    for (const product of parsedProductsToCreate) {
      const curImage = payload.images.find(image => image.originalFileName.split('.')[0] === product.code.toString());
      const productPayload = {
        ...product,
        image: curImage?.fileName ?? product.image,
      };

      await this.productRepository.save(productPayload);
    }

    const productsToDelete = await this.productRepository.find({
      where: [{
        code: Not(In(parsedProductCodes))
      }],
    });
    const productIdsToDelete = productsToDelete.map(product => product.id);

    if (productIdsToDelete.length) {
      await this.productRepository.delete(productIdsToDelete);
    }

    return parsedCSV;
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
