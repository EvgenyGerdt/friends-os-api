import { Controller, Post, HttpStatus, HttpCode, Body } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ExistingUserDTO } from '../../../interfaces/ExistingUser.dto';
import { CreateUserDTO } from '../../../interfaces/CreateUser.dto';
import { UserDetails } from '../../../types/UserDetails.type';

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
  verify(@Body() payload: { jwt: string }) {
    return this.authService.verifyJwt(payload.jwt);
  }
}
