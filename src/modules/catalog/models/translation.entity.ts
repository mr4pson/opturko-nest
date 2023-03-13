import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Translation {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  auth: string;

  @ApiProperty()
  @Column()
  login: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column()
  signin: string;

  @ApiProperty()
  @Column()
  signout: string;

  @ApiProperty()
  @Column()
  send: string;

  @ApiProperty()
  @Column()
  package: string;

  @ApiProperty()
  @Column()
  productNumber: string;

  @ApiProperty()
  @Column()
  code: string;

  @ApiProperty()
  @Column()
  inPackage: string;

  @ApiProperty()
  @Column()
  addToCart: string;

  @ApiProperty()
  @Column()
  women: string;

  @ApiProperty()
  @Column()
  men: string;

  @ApiProperty()
  @Column()
  children: string;

  @ApiProperty()
  @Column()
  categories: string;
}
