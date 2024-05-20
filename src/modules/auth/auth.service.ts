import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpUserDto } from './dto';
import {
  HasherAdapter,
  IdGeneratorAdapter,
} from '../../common/adapters/interfaces';
import { Hasher, IdGenerator } from '../../common/adapters';
import { envs } from '../../common/config';
import { JwtPayload } from './interfaces';
import { Session, SessionLogout, SessionToken, User } from './types';

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
  async createUser(signUpUserDto: SignUpUserDto): Promise<{ user: User }> {
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
  async loginUser(data: SignUpUserDto, ip: string): Promise<Session> {
    const { email, password } = data;
    const user = await this.validateUserCredentials(email, password);
    const token = await this.handleAccessCredentials({
      userId: user.id,
      sessionId: this.idGenerator.id(),
    });
    await this.logAccess(user.id, ip);

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
  async logoutUser(user: User): Promise<SessionLogout> {
    const { id } = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        sessionId: null,
      },
    });
    return {
      message: 'Session finished',
      userId: id,
    };
  }

  // * Store access in database log table
  async logAccess(userId: string, ip: string): Promise<void> {
    await this.prismaService.logAccess.create({
      data: {
        userId,
        ip,
      },
    });
    this.logger.log(`Access: ${userId} - IP: ${ip}`);
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
  signToken(data: JwtPayload): SessionToken {
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

  // * Validate session from JWT (Can be used for checking or refreshing)
  async validateUserJWTSession(payload: JwtPayload): Promise<User> {
    const { userId, sessionId } = payload;

    // * Check user access
    const user = await this.prismaService.user.findUnique({
      where: { id: userId, isActive: true },
      select: {
        id: true,
        sessionId: true,
        email: true,
        roles: true,
      },
    });
    if (!user || !user.sessionId)
      throw new UnauthorizedException('Invalid access');

    // * Check session availability (black list for replaced sessions)
    const isValidSessionId = await this.hasher.compareHash(
      sessionId,
      user.sessionId,
    );
    if (!isValidSessionId) {
      throw new UnauthorizedException('This session has already expired');
    }

    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
  }

  // * This method stores current token on db
  async applySession(userId: string, sessionId: string): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        sessionId: await this.hasher.hash(sessionId),
        lastAccess: new Date(),
      },
    });
  }

  // * Handler for creation and saving
  async handleAccessCredentials(data: JwtPayload): Promise<SessionToken> {
    const token = this.signToken(data);
    await this.applySession(data.userId, data.sessionId);
    return token;
  }

  async refreshToken(jwtPayload: JwtPayload): Promise<Session> {
    const user = await this.validateUserJWTSession(jwtPayload);
    return {
      user,
      token: await this.handleAccessCredentials({
        userId: user.id,
        sessionId: this.idGenerator.id(),
      }),
    };
  }

  // * Error Handler for service
  handleDatabaseErrors(error: any): void {
    const badRequestCodes = {
      P2002: 'This email already exists',
    };

    const requestError = badRequestCodes[error.code];
    if (requestError) throw new BadRequestException(requestError);

    this.logger.error(error);
    throw new BadRequestException();
  }
}
