import { GetFileDto } from '../../../dto';
import { MimeTypes } from '../../../interfaces';

export const validFileMock: GetFileDto = {
  directory: 'products',
  mimeType: MimeTypes.img,
  file: 'martillo.jpg',
};

export const invalidFileMock: GetFileDto = {
  directory: 'products',
  mimeType: MimeTypes.img,
  file: 'martillo-undefined.jpg',
};

export const invalidMimeTypeMock: GetFileDto = {
  directory: 'products',
  mimeType: 'script' as MimeTypes, //! Force invalid mimetype as valid
  file: 'martillo.jpg',
};

export const invalidDirectoryMock: GetFileDto = {
  directory: 'invalid-directory',
  mimeType: MimeTypes.img,
  file: 'martillo.jpg',
};

export const emptyDirectoryMock: GetFileDto = {
  directory: '',
  mimeType: MimeTypes.img,
  file: 'martillo.jpg',
};

export const invalidExtensionMock: GetFileDto = {
  directory: 'products',
  mimeType: MimeTypes.img,
  file: 'martillo.png',
};
