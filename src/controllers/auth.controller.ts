import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDTO } from '../dto/createUser.dto';
import { AuthUserDTO } from '../dto/authUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  @HttpCode(201)
  createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.create(createUserDTO);
  }

  @Post('login')
  login(@Body() authUserDTO: AuthUserDTO) {
    return this.authService.findByEmail(authUserDTO);
  }
}
