import { Injectable, NotFoundException } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { UpdateTranslationDto } from './dto';
import { Translation } from './models';

@Injectable()
export class TranslationService {
  private translationRepository: Repository<Translation>;
  constructor(private connection: Connection) {
    this.translationRepository = this.connection.getRepository(Translation);
  }

  async find(): Promise<Translation> {
    const translations = await this.translationRepository.find();

    if (!translations.length) {
      throw new NotFoundException('No translations exist');
    }

    return translations[0];
  }

  async initTranslation(): Promise<Translation> {
    const emptyTranslation = JSON.stringify({});
    const payload: UpdateTranslationDto = {
      auth: emptyTranslation,
      login: emptyTranslation,
      password: emptyTranslation,
      signin: emptyTranslation,
      signout: emptyTranslation,
      send: emptyTranslation,
      package: emptyTranslation,
      productNumber: emptyTranslation,
      code: emptyTranslation,
      inPackage: emptyTranslation,
      addToCart: emptyTranslation,
      women: emptyTranslation,
      men: emptyTranslation,
      children: emptyTranslation,
      categories: emptyTranslation,
      noProducts: emptyTranslation,
      invalidEmail: emptyTranslation,
      invalidPassword: emptyTranslation,
      serverError: emptyTranslation,
      contactAdministrator: emptyTranslation,
      cheapFirst: emptyTranslation,
      expensiveFirst: emptyTranslation,
    };

    return this.translationRepository.save(payload);
  }

  async update(translation: UpdateTranslationDto): Promise<Translation> {
    const translations = await this.translationRepository.find();

    if (!translations.length) {
      throw new NotFoundException('No translations exist');
    }

    const toUpdate = translations[0];

    return this.translationRepository.save({
      ...toUpdate,
      ...translation,
    });
  }
}
