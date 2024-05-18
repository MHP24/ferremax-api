import { IdGeneratorAdapter } from '../../../common/adapters/interfaces';
import { IdGenerator } from '../../../common/adapters';
import { usersSeed } from './users';

const idGenerator: IdGeneratorAdapter = new IdGenerator();

export const shoppingCartsSeed = [
  {
    cartId: idGenerator.id(),
    userId: usersSeed[0].id,
  },
  {
    cartId: idGenerator.id(),
    userId: usersSeed[1].id,
  },
];
