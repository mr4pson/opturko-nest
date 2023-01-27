import { ApiProperty } from '@nestjs/swagger';

export class ProductsQuery {
  @ApiProperty({
    required: false,
  })
  priceFrom?: number;

  @ApiProperty({
    required: false,
  })
  priceTo?: number;
}
