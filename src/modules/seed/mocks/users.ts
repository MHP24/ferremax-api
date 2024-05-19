import { ValidRoles } from '@prisma/client';
import { IdGenerator } from '../../../common/adapters';
import { IdGeneratorAdapter } from '../../../common/adapters/interfaces';

const idGenerator: IdGeneratorAdapter = new IdGenerator();

export const usersSeed = [
  {
    id: idGenerator.id(),
    email: 'user1@example.com',
    password: 'password123',
    roles: [ValidRoles.user],
  },
  {
    id: idGenerator.id(),
    email: 'user2@example.com',
    password: 'password456',
    roles: [ValidRoles.user],
  },
  {
    id: idGenerator.id(),
    email: 'user3@example.com',
    password: 'password789',
    roles: [ValidRoles.user],
  },
];