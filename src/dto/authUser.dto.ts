import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
