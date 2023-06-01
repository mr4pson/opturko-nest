import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HasRoles } from '../auth/guard/has-roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { RoleType } from '../shared/enum/role-type.enum';
import { ProductsQuery } from './classes/product-query.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './models/product.entity';
import { ProductService } from './product.service';
import { IProductFilterQuery } from './filters';
import { IPaginationResponse } from '../shared/interfaces';

@ApiBearerAuth()
@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) { }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Return all products.',
    type: IPaginationResponse,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Get('')
  getProducts(@Query() query: IProductFilterQuery): Promise<IPaginationResponse<Product>> {
    return this.productService.findAll(query);
  }

  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({
    status: 200,
    description: 'Return products by category.',
    type: IPaginationResponse,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Get('byCategory/:id')
  getProductsByCategory(
    @Param('id') id: number,
    @Query() productsQuery: IProductFilterQuery,
  ): Promise<IPaginationResponse<Product>> {
    return this.productService.findByCategory(id, productsQuery);
  }

  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({
    status: 200,
    description: 'Return product by id.',
    type: Product,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Get(':id')
  getProductById(@Param('id') id: number): Promise<Product> {
    return this.productService.findById(id);
  }

  @ApiOperation({ summary: 'Create product' })
  @ApiCreatedResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: Product,
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request.' })
  @ApiBadRequestResponse({ status: 406, description: 'Not acceptable.' })
  @Post('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createProduct(@Body() product: CreateProductDto): Promise<Product> {
    return this.productService.create(product);
  }

  @ApiOperation({ summary: 'Update product' })
  @ApiOkResponse({
    status: 201,
    description: 'The apllication has been successfully updated.',
    type: Product,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateProduct(
    @Param('id') id: number,
    @Body() product: CreateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, product);
  }

  @ApiOperation({ summary: 'Remove product' })
  @ApiOkResponse({
    status: 201,
    description: 'The product has been successfully removed.',
    type: Number,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Delete(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteProduct(@Param('id') id: number): Promise<number> {
    await this.productService.delete(id);
    return id;
  }
}
