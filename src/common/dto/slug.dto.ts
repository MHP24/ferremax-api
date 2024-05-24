import { IsString, Matches } from 'class-validator';

export class SlugDto {
  @IsString()
  @Matches(new RegExp('^[a-z]+(?:-[a-z]+)*$'), {
    message: 'Invalid slug format',
  })
  slug: string;
}
