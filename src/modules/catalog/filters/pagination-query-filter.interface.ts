import { ApiPropertyOptional } from '@nestjs/swagger';

export class IPaginationQueryFilter {
  @ApiPropertyOptional()
  skip?: number;

  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional()
  priceFrom?: number;

  @ApiPropertyOptional()
  priceTo?: number;
}
