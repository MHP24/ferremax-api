import { IsEnum, IsString } from 'class-validator';
import { MimeTypes } from '../interfaces';

export class GetFileDto {
  @IsString()
  directory: string;

  @IsEnum(MimeTypes)
  mimeType: MimeTypes;

  @IsString()
  file: string;
}
