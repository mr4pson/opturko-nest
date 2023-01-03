import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Attachment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  fileName: string;

  @ApiProperty()
  @Column()
  originalFileName: string;

  @ApiProperty()
  @Column()
  mediaType: string;

  @ApiProperty()
  @Column()
  fileSize: number;

  @ApiProperty()
  @Column()
  isCommentAttachment: boolean;

  @ApiProperty()
  @Column()
  parent: string;

  constructor(
    fileName: string,
    originalFileName: string,
    mediaType: string,
    fileSize: number,
    isCommentAttachment: boolean,
    parent?: string,
  ) {
    this.fileName = fileName;
    this.originalFileName = originalFileName;
    this.mediaType = mediaType;
    this.fileSize = fileSize;
    this.parent = parent;
    this.isCommentAttachment = isCommentAttachment;
  }
}
