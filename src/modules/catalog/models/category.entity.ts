import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Section } from '../enums';
import { Product } from './product.entity';

@Entity()
export class Category {
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
  section: Section;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty({
    type: () => Product,
  })
  @OneToMany((type) => Product, (product) => product.category, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  products: Product[];
}
