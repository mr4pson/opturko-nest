import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateLanguageDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  code: string;
}
