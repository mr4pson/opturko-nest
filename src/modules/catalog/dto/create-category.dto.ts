import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Section } from '../enums';

export class CreateCategoryDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  section: Section;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  title: string;
}
