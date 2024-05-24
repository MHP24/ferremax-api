import { IsString, MinLength } from 'class-validator';

export class SlugParamDto {
  @IsString()
  @MinLength(1)
  slug: string;
}
