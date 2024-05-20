import { Body, Controller, Get, Ip, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto';
import { Auth, AuthRefresh, GetUser, GetRefreshPayload } from './decorators';
import { JwtPayload } from './interfaces';
import { User } from './types';

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
  refreshToken(@GetRefreshPayload() payload: JwtPayload) {
    return this.authService.refreshToken(payload);
  }

  @Patch('logout')
  @Auth()
  logout(@GetUser() user: User) {
    return this.authService.logoutUser(user);
  }
}
