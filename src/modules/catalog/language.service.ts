import { Injectable, NotFoundException } from '@nestjs/common';
import { Connection, DeleteResult, Equal, Repository } from 'typeorm';
import { CreateLanguageDto } from './dto/create-language.dto';
import { Language } from './models/language.entity';

@Injectable()
export class LanguageService {
  private languageRepository: Repository<Language>;
  constructor(private connection: Connection) {
    this.languageRepository = this.connection.getRepository(Language);
  }

  async findAll(): Promise<Language[]> {
    return this.languageRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findById(id: number): Promise<Language> {
    const language = await this.languageRepository.findOneOrFail({
      where: {
        id: Equal(id),
      },
    });

    if (!language) {
      throw new NotFoundException('Such language does not exist');
    }

    return language;
  }

  async create(language: CreateLanguageDto): Promise<Language> {
    return this.languageRepository.save({
      ...language,
    } as any);
  }

  async update(id: number, language: CreateLanguageDto): Promise<Language> {
    const toUpdate = await this.languageRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!toUpdate) {
      throw new NotFoundException('Such language does not exist');
    }

    return this.languageRepository.save({
      ...toUpdate,
      ...language,
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    const toDelete = await this.languageRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!toDelete) {
      throw new NotFoundException('Such language does not exist');
    }

    return await this.languageRepository.delete(id);
  }
}
