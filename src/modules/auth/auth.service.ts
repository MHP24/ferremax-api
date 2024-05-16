import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpUserDto } from './dto';
import { HasherAdapter } from '../../common/adapters/interfaces';
import { Hasher } from '../../common/adapters';
import { envs } from '../../common/config';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  private hasher: HasherAdapter = new Hasher();

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // * Register user and return JWT (auto sign in on register)
  async createUser(signUpUserDto: SignUpUserDto) {
    try {
      const { password, ...rest } = signUpUserDto;
      // * User creation
      const user = await this.prismaService.user.create({
        data: {
          password: await this.hasher.hash(password),
          ...rest,
        },
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          roles: user.roles,
        },
      };
    } catch (error) {
      this.handleDatabaseErrors(error);
    }
  }

  /*
   * Makes validation using validateUser and
   * if the user is valid generates JWT
   */
  async loginUser(data: SignUpUserDto) {
    const { email, password } = data;
    const user = await this.validateUser(email, password);

    const token = await this.handleToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
      token,
    };
  }

  // * Valiadate user credentials vs db
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email, isActive: true },
    });
    const isValidPassword = await this.hasher.compareHash(
      password,
      user?.password ?? '',
    );

    if (!user || !isValidPassword)
      throw new UnauthorizedException('Invalid email or password');

    return user;
  }

  // * Sign token using JWT Strategy
  signToken(id: string) {
    return {
      accessToken: this.jwtService.sign({ id }),
      refreshToken: this.jwtService.sign(
        { id },
        {
          expiresIn: envs.jwtRefreshExpireText,
          secret: envs.jwtRefreshSecret,
        },
      ),
      expiresIn: new Date().setTime(
        new Date().getTime() + envs.jwtExpireSeconds * 1000,
      ),
    };
  }

  // * This method stores current token on db
  async applyToken(userId: string, token: string) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        // * Token must be saved hashed
        accessToken: await this.hasher.hash(token),
      },
    });
  }

  // * Handler for creation and saving
  async handleToken(userId: string) {
    const token = this.signToken(userId);
    await this.applyToken(userId, token.accessToken);
    return token;
  }

  async refreshToken(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        roles: true,
      },
    });

    return {
      user,
      token: await this.handleToken(user.id),
    };
  }

  // * Handler for service
  handleDatabaseErrors(error: any) {
    const badRequestCodes = {
      P2002: 'This email already exists',
    };

    const requestError = badRequestCodes[error.code];
    if (requestError) throw new BadRequestException(requestError);

    this.logger.error(error);
    throw new BadRequestException();
  }
}
