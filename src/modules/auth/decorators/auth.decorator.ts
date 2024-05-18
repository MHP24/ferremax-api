import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '@prisma/client';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role.guard';

export const META_ROLES = 'user_roles';

export const Auth = (...args: ValidRoles[]) =>
  applyDecorators(
    RoleProtected(...args),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
