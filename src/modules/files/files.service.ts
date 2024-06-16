import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { GetFileDto } from './dto';
import { envs } from '../../common/config';

@Injectable()
export class FilesService {
  // * Get files from /static directory
  getFile(getFileDto: GetFileDto) {
    const { directory, mimeType, file } = getFileDto;
    // * Dir location of file (static directory to handle logic and validate instead public folder)
    const filePath = resolve(envs.staticFilePath, directory, mimeType, file);

    if (!existsSync(filePath)) throw new NotFoundException(`${file} not found`);

    return filePath;
  }
}
