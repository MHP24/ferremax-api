import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces';
import { envs } from '../../../common/config';
import { PrismaService } from '../../../modules/prisma/prisma.service';
import { Hasher } from '../../../common/adapters';
import { HasherAdapter } from '../../../common/adapters/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private hasher: HasherAdapter = new Hasher();

  constructor(private readonly prisma: PrismaService) {
    super({
      secretOrKey: envs.jwtSecret,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { userId, sessionId } = payload;

    // * Check user access
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive || !user.sessionId)
      throw new UnauthorizedException('Invalid access');

    // * Check session availability (black list)
    const isValidSessionId = await this.hasher.compareHash(
      sessionId,
      user.sessionId,
    );
    if (!isValidSessionId) {
      throw new UnauthorizedException('This session has already expired');
    }

    return { ...user, password: null };
  }
}
