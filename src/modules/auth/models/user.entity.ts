import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChangePasswordRequest } from './change-password-request.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty()
  @Column({ nullable: false })
  login: string;

  @ApiProperty()
  @Column({ nullable: false })
  passwordHash?: string;

  @ApiProperty()
  @Column({ nullable: false })
  role: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => ChangePasswordRequest, (request) => request.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  changePasswordRequests?: ChangePasswordRequest[];
}
