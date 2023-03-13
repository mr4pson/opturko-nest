import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateTranslationDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  auth: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  login: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  signin: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  signout: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  send: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  package: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  productNumber: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  code: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  inPackage: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  addToCart: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  women: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  men: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  children: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  categories: string;
}
