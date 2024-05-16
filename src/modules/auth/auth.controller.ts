import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto';
import { AuthRefresh, GetUserId } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpUserDto: SignUpUserDto) {
    return this.authService.createUser(signUpUserDto);
  }

  @Post('sign-in')
  signIn(@Body() signInUserDto: SignInUserDto) {
    return this.authService.loginUser(signInUserDto);
  }

  @Get('refresh')
  @AuthRefresh()
  refreshToken(@GetUserId() userId: string) {
    return this.authService.refreshToken(userId);
  }
}
