import { Controller, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { GetFileDto } from './dto';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('/:directory/:mimeType/:file')
  getFile(@Param() getFileDto: GetFileDto, @Res() res: Response) {
    return res.sendFile(this.filesService.getFile(getFileDto));
  }
}
