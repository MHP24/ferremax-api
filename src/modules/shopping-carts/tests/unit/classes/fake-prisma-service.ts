import { createShoppingCartMock, getMyShoppingCartMock } from '../mocks';

export class FakePrismaService {
  shoppingCart = {
    findFirst: jest.fn().mockImplementation(({ where: { userId } }) => {
      return getMyShoppingCartMock[userId]?.dbResponse;
    }),

    create: jest.fn().mockImplementation(({ data: { userId } }) => {
      return createShoppingCartMock[userId]?.dbResponse;
    }),
  };
}
