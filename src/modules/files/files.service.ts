import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { GetFileDto } from './dto';

@Injectable()
export class FilesService {
  // * Get files from /static directory
  getFile(getFileDto: GetFileDto) {
    const { directory, mimeType, file } = getFileDto;
    // * Dir location of file (static directory to handle logic and validate instead public folder)
    const filePath = join(
      __dirname,
      `../../../../static/${directory}/${mimeType}/${file}`,
    );
    if (!existsSync(filePath)) throw new NotFoundException(`${file} not found`);

    return filePath;
  }
}
