import { PrismaService } from '../../../../prisma/prisma.service';
import {
  createUserBodyMock,
  repeatedUserBodyMock,
  signInUserMock,
} from '../mocks';

export const resetMocks = async (prismaService: PrismaService) => {
  await prismaService.$transaction([
    prismaService.logAccess.deleteMany({
      where: { User: { email: signInUserMock.email } },
    }),
    prismaService.user.deleteMany({
      where: {
        email: {
          in: [
            createUserBodyMock.email,
            repeatedUserBodyMock.email,
            signInUserMock.email,
          ],
        },
      },
    }),
  ]);
};
