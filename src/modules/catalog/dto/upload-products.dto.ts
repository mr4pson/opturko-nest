import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Attachment } from 'src/modules/attachment/attachment.entity';

export class UploadProductsDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  csvFile: string;

  @IsNotEmpty()
  @ApiProperty({
    type: Attachment,
    isArray: true,
    required: true,
  })
  images: Attachment[];
}
