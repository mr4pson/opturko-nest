import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @Column()
  number: number;

  @ApiProperty()
  @Column({ unique: true })
  code: number;

  @ApiProperty()
  @Column()
  numberInPack: number;

  @ApiProperty()
  @Column()
  sizes: string;

  @ApiProperty()
  @Column()
  image: string;

  @ApiProperty({
    type: () => Category,
  })
  @ManyToOne((type) => Category, (category) => category.products)
  category: Category;
}
