import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
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
}
