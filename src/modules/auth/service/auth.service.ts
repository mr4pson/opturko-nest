import { User } from '../models/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Connection, DeleteResult, Equal, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegistrationDto } from '../registration.dto';
// import { MailService } from 'src/modules/mail/mail.service';
import { generateRandomString } from 'src/modules/shared/utils/generate-random-string.utils';
import { RoleType } from 'src/modules/shared/enum/role-type.enum';
import { AccessTokenResponse } from '../interfaces/access-token.class';

@Injectable()
export class AuthService {
  private userRepository: Repository<User>;
  constructor(
    private jwtService: JwtService,
    private connection: Connection, // private mailService: MailService,
  ) {
    this.userRepository = this.connection.getRepository(User);
  }

  async initAdmin() {
    const admin = await this.userRepository.find()[0];

    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash('salmonella', salt);

      return await this.userRepository.save({
        login: 'admin@admin.ru',
        passwordHash: hashedPass,
        role: RoleType.ADMIN,
      });
    }
  }

  async validateUser(login: string, pass: string): Promise<User | null> {
    const user: User = await this.userRepository.findOne({ where: { login } });

    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { ...secureUser } = user;
      return secureUser;
    }

    return null;
  }

  async login(user: User): Promise<AccessTokenResponse> {
    const payload = {
      id: user.id,
      role: user.role,
      login: user.login,
      createdAt: user.createdAt,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { id: 'DESC' },
      where: {
        role: RoleType.USER,
      },
    });
  }

  findById(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: {
        id: Equal(id),
      },
    });
  }

  async registrate(user: RegistrationDto): Promise<User> {
    // const password = generateRandomString(8);

    const userPayload: User = this.userRepository.create({
      login: user.email,
      role: RoleType.USER,
      passwordHash: await bcrypt.hash(user.password, 10),
    });

    // await this.mailService.userRegistrationSuccessful(userPayload, password);

    return await this.userRepository.save(userPayload);
  }

  async update(id: number, user: RegistrationDto): Promise<User> {
    const toUpdate = await this.userRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!toUpdate) {
      throw new NotFoundException('Such user does not exist');
    }

    return this.userRepository.save({
      ...toUpdate,
      login: user.email,
      passwordHash: await bcrypt.hash(user.password, 10),
    } as any);
  }

  async delete(id: number): Promise<DeleteResult> {
    const toDelete = await this.userRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!toDelete) {
      throw new NotFoundException('Such user does not exist');
    }

    return await this.userRepository.delete(id);
  }
}
