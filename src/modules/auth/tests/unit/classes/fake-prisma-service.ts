import { dbCreateUserMock, usersMock } from '../mocks';

export class FakePrismaService {
  user = {
    create: jest.fn().mockImplementation(() => {
      return dbCreateUserMock;
    }),

    findUnique: jest.fn().mockImplementation(({ where: { email } }) => {
      return usersMock[email];
    }),

    update: jest.fn().mockImplementation(() => {}),
  };

  logAccess = {
    create: jest.fn().mockImplementation(() => {}),
  };
}
