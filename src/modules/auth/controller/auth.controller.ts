import { Controller, Post, HttpStatus, HttpCode, Body } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ExistingUserDTO } from '../../../interfaces/ExistingUser.dto';
import { CreateUserDTO } from '../../../interfaces/CreateUser.dto';
import { UserDetails } from '../../../types/UserDetails.type';
import { SendCodeDto } from '../../../interfaces/SendCode.dto';
import { VerifyCodeDto } from '../../../interfaces/VerifyCode.dto';
import { ResetPasswordDto } from '../../../interfaces/ResetPassword.dto';
import { VerifyJWTDto } from '../../../interfaces/VerifyJWT.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() user: CreateUserDTO): Promise<UserDetails | null> {
    return this.authService.register(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: ExistingUserDTO): Promise<{ token: string } | null> {
    return this.authService.login(user);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verify(@Body() payload: VerifyJWTDto) {
    return this.authService.verifyJwt(payload.jwt);
  }

  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  sendCode(@Body() payload: SendCodeDto) {
    return this.authService;
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  verifyCode(@Body() payload: VerifyCodeDto) {
    return this.authService;
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() payload: ResetPasswordDto) {
    return this.authService;
  }
}
