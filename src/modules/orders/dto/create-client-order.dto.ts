import { IsEmail, IsString, Matches } from 'class-validator';

export class CreateClientOrderDto {
  @IsString()
  address: string;

  @IsEmail()
  email: string;

  @Matches(new RegExp('^\\+56(2|9)\\d{8}$'), {
    message: 'Invalid phone number e.g: +56912345678',
  })
  phoneNumber: string;
}
