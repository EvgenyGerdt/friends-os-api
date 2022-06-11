import { ApiProperty } from '@nestjs/swagger';
import { PersonalData } from '../models/User.schema';

export class CreateUserDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  personalData: PersonalData;
}
