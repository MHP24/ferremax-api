import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from '../interfaces';

export const GetRefreshPayload = createParamDecorator(
  (_, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.payload;
  },
);
