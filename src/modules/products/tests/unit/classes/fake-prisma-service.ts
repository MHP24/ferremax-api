import { findAllProductsMock, findManyProductsByIdMock } from '../mocks';
import { fakeBySlugProductsMock } from '../mocks';

export class FakePrismaService {
  product = {
    findMany: jest.fn().mockImplementation((query) => {
      const keys = Object.keys(query);

      if (keys.includes('skip') && keys.includes('take')) {
        const { skip, take } = query;
        return findAllProductsMock.slice(skip, skip + take);
      }

      if (keys.includes('where')) {
        return findManyProductsByIdMock.filter(({ productId }) =>
          query.where.productId.in.includes(productId),
        );
      }
    }),
    count: jest.fn().mockResolvedValue(() => {
      return findAllProductsMock.length;
    }),
    findUnique: jest.fn().mockImplementation(({ where: { slug } }) => {
      return fakeBySlugProductsMock[slug]?.dbProduct ?? null;
    }),
  };
}
