import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Connection, Repository } from 'typeorm';
import { RoleType } from '../shared/enum/role-type.enum';
import { LoginDto } from './dto/login.dto';
import { HasRoles } from './guard/has-roles.decorator';
// import { MailService } from '../mail/mail.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { AccessTokenResponse } from './interfaces/access-token.class';
import { ChangePasswordRequest } from './models/change-password-request.entity';
import { User } from './models/user.entity';
import { RegistrationDto } from './registration.dto';
import { AuthService } from './service/auth.service';
import { ChangePasswordRequestService } from './service/change-password-request.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private userRepository: Repository<User>;
  constructor(
    private authService: AuthService,
    // private mailService: MailService,
    private changePasswordRequestService: ChangePasswordRequestService,
    private connection: Connection,
  ) {
    this.userRepository = this.connection.getRepository(User);
  }

  @ApiOperation({ summary: 'Init admin' })
  @ApiResponse({
    status: 200,
    description: 'Creates admin.',
    type: User,
  })
  @Get('init-admin')
  async initAdmin() {
    return this.authService.initAdmin();
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: User,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Get('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getUsers(): Promise<User[]> {
    return this.authService.findAll();
  }

  @ApiOperation({ summary: 'Get users by id' })
  @ApiResponse({
    status: 200,
    description: 'Return user by id.',
    type: User,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Get(':id')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.authService.findById(id);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'Logins in app',
    type: AccessTokenResponse,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Body() loginData: LoginDto) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Registrate user' })
  @ApiResponse({
    status: 200,
    description: 'Registrates a user.',
    type: User,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Post('registrate')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async registrate(@Body() userData: RegistrationDto) {
    return this.authService.registrate(userData);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({
    status: 201,
    description: 'The apllication has been successfully updated.',
    type: User,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(
    @Param('id') id: number,
    @Body() user: RegistrationDto,
  ): Promise<User> {
    return this.authService.update(id, user);
  }

  @ApiOperation({ summary: 'Remove user' })
  @ApiOkResponse({
    status: 201,
    description: 'The user has been successfully removed.',
    type: Number,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @Delete(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteUser(@Param('id') id: number): Promise<number> {
    await this.authService.delete(id);

    return id;
  }

  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Refreshes JWT token',
    type: AccessTokenResponse,
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    const user = await this.userRepository.findOne(req.user.id);
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Check if email exists' })
  @ApiResponse({
    status: 200,
    description: 'Checks if email exists',
  })
  @ApiConflictResponse({ status: 409, description: 'Email already exists.' })
  @Get('check-email/:email')
  async checkIfEmailExist(@Param('email') email: string) {
    const user = await this.userRepository.findOne({ where: { login: email } });

    if (user) {
      throw new ConflictException();
    }
    return new Promise((resolve) => resolve(null));
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: 200,
    description: 'Resets password',
    // type: ChangePasswordRequest,
  })
  @ApiNotFoundResponse({ status: 404, description: 'Not found.' })
  @Post('reset-password')
  async resetPassword(@Body() data: { login: string }) {
    const user = await this.userRepository.findOne({
      where: { login: data.login },
    });

    if (user) {
      const changePasswordRequest =
        await this.changePasswordRequestService.create(user);
      // return this.mailService.sendResetPasswordConfirmation(user, changePasswordRequest.token);
      return changePasswordRequest;
    }
    throw new NotFoundException();
  }

  @ApiOperation({ summary: 'Confirm password reset' })
  @ApiResponse({
    status: 200,
    description: 'Confirms password reset',
    // type: ChangePasswordRequest,
  })
  @ApiNotFoundResponse({ status: 404, description: 'Not found.' })
  @Post('reset-password-confirmation')
  async resetPasswordConfirmation(@Body() data: { token: string }) {
    const changePasswordRequest =
      await this.changePasswordRequestService.findByToken(data.token);

    if (changePasswordRequest) {
      return await this.changePasswordRequestService.executeRequest(
        changePasswordRequest,
      );
    }
    throw new NotFoundException();
  }
}
