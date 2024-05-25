import { Body, Controller, Get, Ip, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth, AuthRefresh, GetUser, GetRefreshPayload } from './decorators';
// * Types
import { JwtPayload } from './interfaces';
import { User } from './types';
import { SignInUserDto, SignUpUserDto } from './dto';
// * Swagger docs
import { ApiTags } from '@nestjs/swagger';
import { Swagger } from '../../common/swagger/decorators';
import {
  logoutDocumentation,
  refreshDocumentation,
  signInDocumentation,
  signUpDocumentation,
} from './docs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @Swagger(signUpDocumentation)
  signUp(@Body() signUpUserDto: SignUpUserDto) {
    return this.authService.createUser(signUpUserDto);
  }

  @Post('sign-in')
  @Swagger(signInDocumentation)
  signIn(@Body() signInUserDto: SignInUserDto, @Ip() ip: string) {
    return this.authService.loginUser(signInUserDto, ip);
  }

  @Get('refresh')
  @Swagger(refreshDocumentation)
  @AuthRefresh()
  refreshToken(@GetRefreshPayload() payload: JwtPayload) {
    return this.authService.refreshToken(payload);
  }

  @Patch('logout')
  @Swagger(logoutDocumentation)
  @Auth()
  logout(@GetUser() user: User) {
    return this.authService.logoutUser(user);
  }
}
