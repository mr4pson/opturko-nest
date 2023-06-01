import { ApiPropertyOptional } from '@nestjs/swagger';
import { IPaginationQueryFilter } from './pagination-query-filter.interface';

export class IProductFilterQuery extends IPaginationQueryFilter {
  @ApiPropertyOptional()
  code?: number;
}
