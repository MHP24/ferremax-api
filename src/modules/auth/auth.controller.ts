import { Body, Controller, Get, Ip, Patch, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto';
import { Auth, AuthRefresh, GetUser, GetUserId } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpUserDto: SignUpUserDto) {
    return this.authService.createUser(signUpUserDto);
  }

  @Post('sign-in')
  signIn(@Body() signInUserDto: SignInUserDto, @Ip() ip: string) {
    return this.authService.loginUser(signInUserDto, ip);
  }

  @Get('refresh')
  @AuthRefresh()
  refreshToken(@GetUserId() userId: string) {
    return this.authService.refreshToken(userId);
  }

  @Patch('logout')
  @Auth()
  logout(@GetUser() user: User) {
    return this.authService.logoutUser(user);
  }
}
