import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Section } from '../enums';

export class CreateProductDto {
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    required: true,
  })
  price: number;

  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    required: true,
  })
  number: number;

  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    required: true,
  })
  code: number;

  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    required: true,
  })
  numberInPack: number;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  sizes: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  image: string;

  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    required: true,
  })
  category: number;
}
