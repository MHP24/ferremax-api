import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FilesService } from '../../files.service';
import {
  emptyDirectoryMock,
  invalidDirectoryMock,
  invalidExtensionMock,
  invalidFileMock,
  invalidMimeTypeMock,
  validFileMock,
} from './mocks';

describe('[Unit] files.service.ts', () => {
  let filesService: FilesService;

  beforeAll(async () => {
    const filesModule = await Test.createTestingModule({
      providers: [FilesService],
    }).compile();

    filesService = filesModule.get<FilesService>(FilesService);
  });

  describe('getFile', () => {
    it('Should return a file path', () => {
      const file = filesService.getFile(validFileMock);

      expect(typeof file).toBe('string');
    });

    it('Should throw NotFoundException (invalid file)', () => {
      try {
        filesService.getFile(invalidFileMock);
        fail('NotFoundException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`${invalidFileMock.file} not found`);
      }
    });

    it('Should throw NotFoundException (invalid mimetype)', () => {
      try {
        filesService.getFile(invalidMimeTypeMock);
        fail('NotFoundException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`${invalidMimeTypeMock.file} not found`);
      }
    });

    it('Should throw NotFoundException (invalid directory)', () => {
      try {
        filesService.getFile(invalidDirectoryMock);
        fail('NotFoundException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`${invalidDirectoryMock.file} not found`);
      }
    });

    it('Should throw NotFoundException (empty directory)', () => {
      try {
        filesService.getFile(emptyDirectoryMock);
        fail('NotFoundException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`${emptyDirectoryMock.file} not found`);
      }
    });

    it('Should throw NotFoundException (valid structure except file extension)', () => {
      try {
        filesService.getFile(invalidExtensionMock);
        fail('NotFoundException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`${invalidExtensionMock.file} not found`);
      }
    });
  });
});
