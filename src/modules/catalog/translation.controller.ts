import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
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
import { UpdateTranslationDto } from './dto';
import { Translation } from './models';
import { TranslationService } from './translation.service';

@ApiBearerAuth()
@ApiTags('translations')
@Controller('translations')
export class TranslationController {
  constructor(private translationService: TranslationService) {}

  @ApiOperation({ summary: 'Get translations' })
  @ApiResponse({
    status: 200,
    description: 'Return translations.',
    type: Translation,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Get('')
  getTranslations(): Promise<Translation> {
    return this.translationService.find();
  }

  @ApiOperation({ summary: 'init translation' })
  @ApiCreatedResponse({
    status: 201,
    description: 'The translation has been successfully created.',
    type: Translation,
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request.' })
  @ApiBadRequestResponse({ status: 406, description: 'Not acceptable.' })
  @Get('init-translations')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async initTranslation(): Promise<Translation> {
    return this.translationService.initTranslation();
  }

  @ApiOperation({ summary: 'Update translations' })
  @ApiOkResponse({
    status: 201,
    description: 'The translation has been successfully updated.',
    type: Translation,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Put('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateTranslation(
    @Body() translation: UpdateTranslationDto,
  ): Promise<Translation> {
    return this.translationService.update(translation);
  }
}
