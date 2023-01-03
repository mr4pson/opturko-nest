import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './models/category.entity';

@ApiBearerAuth()
@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Return all categories.',
    type: Category,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Get('')
  getCategories(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({
    status: 200,
    description: 'Return category by id.',
    type: Category,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Get(':id')
  getCategoryById(@Param('id') id: number): Promise<Category> {
    return this.categoryService.findById(id);
  }

  @ApiOperation({ summary: 'Get categories by section' })
  @ApiResponse({
    status: 200,
    description: 'Return category by section.',
    type: Category,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Get('bySection/:section')
  getCategoriesBySection(
    @Param('section') section: string,
  ): Promise<Category[]> {
    return this.categoryService.findBySection(section);
  }

  @ApiOperation({ summary: 'Create category' })
  @ApiCreatedResponse({
    status: 201,
    description: 'The category has been successfully created.',
    type: Category,
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request.' })
  @ApiBadRequestResponse({ status: 406, description: 'Not acceptable.' })
  @Post('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createCategory(@Body() category: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(category);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiOkResponse({
    status: 201,
    description: 'The apllication has been successfully updated.',
    type: Category,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateCategory(
    @Param('id') id: number,
    @Body() category: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, category);
  }

  @ApiOperation({ summary: 'Remove category' })
  @ApiOkResponse({
    status: 201,
    description: 'The category has been successfully removed.',
    type: Number,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Delete(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteCategory(@Param('id') id: number): Promise<number> {
    await this.categoryService.delete(id);
    return id;
  }
}
