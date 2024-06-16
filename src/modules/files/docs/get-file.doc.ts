import { ApiParam, ApiResponse } from '@nestjs/swagger';

export const getFileDoc = [
  ApiParam({
    name: 'directory',
    type: String,
    required: true,
    description: 'Main dir / category e.g: products',
    example: 'products',
  }),
  ApiParam({
    name: 'mimeType',
    type: String,
    required: true,
    description: 'file format / mimeType (img, video, document, audio)',
    example: 'img',
  }),
  ApiParam({
    name: 'file',
    type: String,
    required: true,
    description: 'Unique file name **including extension** e.g: martillo.jpg',
    example: 'martillo.jpg',
  }),
  ApiResponse({
    status: 200,
    description: 'File found successfully',
  }),
  ApiResponse({
    status: 404,
    description: 'File not found',
  }),
];
