import { ValidRoles } from '@prisma/client';
import { branchesSeed } from './branches';

export const usersSeed = [
  {
    id: 'f65fc959-225a-4817-8867-8b9d98f6b092',
    email: 'user1@example.com',
    password: 'password123',
    roles: [ValidRoles.user],
  },
  {
    id: 'cd8e07a2-2bfc-4867-90b3-2a5a4e904a28',
    email: 'seller@example.com',
    password: 'password123',
    branchId: branchesSeed[2].branchId,
    roles: [ValidRoles.seller],
  },
  {
    id: '26c92e50-571f-4909-9377-6ec681ae7ed4',
    email: 'user3@example.com',
    password: 'password789',
    roles: [ValidRoles.user],
  },
];
