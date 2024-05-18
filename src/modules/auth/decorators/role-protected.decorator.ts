import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '@prisma/client';
import { META_ROLES } from './auth.decorator';

export const RoleProtected = (...args: ValidRoles[]) =>
  SetMetadata(META_ROLES, args);
