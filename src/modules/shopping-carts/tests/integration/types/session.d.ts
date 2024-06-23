import { ValidRoles } from '@prisma/client';

type User = {
  userId: string;
  email: string;
  roles: ValidRoles[];
};

type Token = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type Session = {
  user: User;
  token: Token;
};
