import { ApiProperty } from '@nestjs/swagger';

export class IPaginationResponse<Entity> {
  @ApiProperty()
  data: Entity[];

  @ApiProperty()
  totalLength: number;

  @ApiProperty()
  skip: number;

  @ApiProperty()
  limit: number;
}
