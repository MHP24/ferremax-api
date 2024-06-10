import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}
