import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { FakeJWTService, FakePrismaService } from '../classes';
import { SignUpUserDto } from '../../dto';
import { Hasher } from '../../../../common/adapters';
import { HasherAdapter } from '../../../../common/adapters/interfaces';
import {
  createUserMock,
  loginCorrectCredentialsMock,
  loginWrongCredentialsMock,
  passToHashMock,
  userCredentialsMock,
  userServiceMock,
  usersMock,
} from '../mocks';

describe('[Unit] auth.service.ts', () => {
  let authService: AuthService;

  beforeAll(async () => {
    const authModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useClass: FakeJWTService,
        },
        {
          provide: PrismaService,
          useClass: FakePrismaService,
        },
      ],
    }).compile();

    authService = authModule.get<AuthService>(AuthService);
  });

  describe('createUser', () => {
    it('Should create an user and return it', async () => {
      const mockUser: SignUpUserDto = createUserMock;
      const serviceResponse = await authService.createUser(mockUser);
      expect(serviceResponse).toEqual(userServiceMock);
    });
  });

  describe('loginUser', () => {
    it('Should grant access (user & JWT)', async () => {
      const { user, token } = await authService.loginUser(
        loginCorrectCredentialsMock.user,
        loginCorrectCredentialsMock.ip,
      );

      expect(user).toBeDefined();
      expect(token).toBeDefined();
    });

    it('Should throw UnauthorizedException', async () => {
      try {
        await authService.loginUser(
          loginWrongCredentialsMock.user,
          loginWrongCredentialsMock.ip,
        );
        fail('UnauthorizedException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid email or password');
      }
    });
  });

  describe('hasher', () => {
    it('Should hash user password', async () => {
      const hasher: HasherAdapter = new Hasher();
      const hash = await hasher.hash(passToHashMock);
      expect(hash).not.toEqual(passToHashMock);
      expect(hash.length > 15).toBe(true);
    });

    it('Should create differents hashes', async () => {
      const hasher: HasherAdapter = new Hasher();
      const firstHash = await hasher.hash(passToHashMock);
      const secondHash = await hasher.hash(passToHashMock);

      expect(firstHash).not.toEqual(secondHash);
      expect(firstHash).not.toEqual(passToHashMock);
      expect(secondHash).not.toEqual(passToHashMock);
    });
  });

  describe('validateUserCredentials', () => {
    it('Should be ok user credentials', async () => {
      const { email, password } = userCredentialsMock;
      const serviceResponse = await authService.validateUserCredentials(
        email,
        password,
      );

      expect(serviceResponse).toBeDefined();
      expect(serviceResponse).toEqual(usersMock[email]);
    });

    it('Should throw UnauthorizedException', async () => {
      const { email, password } = userCredentialsMock;

      try {
        await authService.validateUserCredentials(
          email,
          `${password}+invalid-pass-character`,
        );
        fail('UnauthorizedException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid email or password');
      }
    });
  });
});
