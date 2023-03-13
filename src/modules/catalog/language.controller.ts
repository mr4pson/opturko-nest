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
import { CreateLanguageDto } from './dto';
import { LanguageService } from './language.service';
import { Language } from './models';

@ApiBearerAuth()
@ApiTags('languages')
@Controller('languages')
export class LanguageController {
  constructor(private languageService: LanguageService) {}

  @ApiOperation({ summary: 'Get all languages' })
  @ApiResponse({
    status: 200,
    description: 'Return all languages.',
    type: Language,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Get('')
  getLanguages(): Promise<Language[]> {
    return this.languageService.findAll();
  }

  @ApiOperation({ summary: 'Get language by id' })
  @ApiResponse({
    status: 200,
    description: 'Return language by id.',
    type: Language,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Get(':id')
  getLanguageById(@Param('id') id: number): Promise<Language> {
    return this.languageService.findById(id);
  }

  @ApiOperation({ summary: 'Create language' })
  @ApiCreatedResponse({
    status: 201,
    description: 'The language has been successfully created.',
    type: Language,
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request.' })
  @ApiBadRequestResponse({ status: 406, description: 'Not acceptable.' })
  @Post('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createLanguage(@Body() language: CreateLanguageDto): Promise<Language> {
    return this.languageService.create(language);
  }

  @ApiOperation({ summary: 'Update language' })
  @ApiOkResponse({
    status: 201,
    description: 'The language has been successfully updated.',
    type: Language,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateLanguage(
    @Param('id') id: number,
    @Body() language: CreateLanguageDto,
  ): Promise<Language> {
    return this.languageService.update(id, language);
  }

  @ApiOperation({ summary: 'Remove language' })
  @ApiOkResponse({
    status: 201,
    description: 'The language has been successfully removed.',
    type: Number,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Delete(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteLanguage(@Param('id') id: number): Promise<number> {
    await this.languageService.delete(id);
    return id;
  }
}
