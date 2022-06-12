import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDTO } from '../../../dto/createUser.dto';
import { AuthUserDTO } from '../../../dto/authUser.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  @HttpCode(201)
  createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.create(createUserDTO);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() authUserDTO: AuthUserDTO) {
    return this.authService.login(authUserDTO);
  }
}
