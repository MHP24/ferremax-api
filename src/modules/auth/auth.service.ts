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
import {
  HasherAdapter,
  IdGeneratorAdapter,
} from '../../common/adapters/interfaces';
import { Hasher, IdGenerator } from '../../common/adapters';
import { envs } from '../../common/config';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  private hasher: HasherAdapter = new Hasher();
  private idGenerator: IdGeneratorAdapter = new IdGenerator();

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
    const user = await this.validateUserCredentials(email, password);
    const token = await this.handleToken({
      userId: user.id,
      sessionId: this.idGenerator.id(),
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
      token,
    };
  }

  // * Close session for user
  logoutUser(user: User) {
    return this.prismaService.user.update({
      where: { id: user.id },
      data: {
        sessionId: null,
      },
    });
  }

  // * Valiadate user credentials vs db
  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<User> {
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
  signToken(data: JwtPayload) {
    return {
      accessToken: this.jwtService.sign(data),
      refreshToken: this.jwtService.sign(data, {
        expiresIn: envs.jwtRefreshExpireText,
        secret: envs.jwtRefreshSecret,
      }),
      expiresIn: new Date().setTime(
        new Date().getTime() + envs.jwtExpireSeconds * 1000,
      ),
    };
  }

  // * This method stores current token on db
  async applySession(userId: string, sessionId: string) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        sessionId: await this.hasher.hash(sessionId),
      },
    });
  }

  // * Handler for creation and saving
  async handleToken(data: JwtPayload) {
    const token = this.signToken(data);
    await this.applySession(data.userId, data.sessionId);
    return token;
  }

  async refreshToken(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        roles: true,
        sessionId: true,
      },
    });

    return {
      user,
      token: await this.handleToken({ userId, sessionId: user.sessionId }),
    };
  }

  // * Error Handler for service
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
