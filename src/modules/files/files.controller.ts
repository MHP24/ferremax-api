import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { GetFileDto } from './dto';
import { Response } from 'express';
import { Swagger } from '../../common/swagger/decorators';
import { getFileDoc } from './docs';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('/:directory/:mimeType/:file')
  @Swagger(getFileDoc)
  getFile(@Param() getFileDto: GetFileDto, @Res() res: Response) {
    return res.sendFile(this.filesService.getFile(getFileDto));
  }
}
