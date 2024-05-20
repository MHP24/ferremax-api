import { ValidRoles } from '@prisma/client';

export type User = {
  id: string;
  email: string;
  roles: ValidRoles[];
};
