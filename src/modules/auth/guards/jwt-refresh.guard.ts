import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { envs } from '../../../common/config';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = (request.headers.authorization ?? '').split(' ')[1];
      if (!token) return false;

      const verification: JwtPayload = this.jwtService.verify(token, {
        secret: envs.jwtRefreshSecret,
      });
      request.payload = {
        userId: verification.userId,
        sessionId: verification.sessionId,
      };

      return true;
    } catch (error) {
      throw new ForbiddenException('Invalid access token');
    }
  }
}
