import { ApiProperty } from '@nestjs/swagger';
import { ChangePasswordStatuses } from 'src/modules/shared/enum/change-password-statuses.enum';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ChangePasswordRequest {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  token: string;

  @ApiProperty()
  @Column()
  status: ChangePasswordStatuses;

  @ApiProperty()
  @Column()
  createdAt: Date;

  @ApiProperty()
  @Column()
  updatedAt: Date;

  @ApiProperty()
  @ManyToOne((type) => User, (user) => user.changePasswordRequests, {
    onDelete: 'CASCADE',
  })
  user: User;
}
