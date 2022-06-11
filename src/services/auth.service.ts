import { Injectable } from '@nestjs/common';
import { User } from '../models/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from '../dto/createUser.dto';
import { AuthUserDTO } from '../dto/authUser.dto';
import { ErrorResponse } from '../models/Error.model';
import { comparePasswords, encodePassword } from '../utils/bcrypt';
import { UserDetails } from '../types/UserDetails.type';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  _getUserDetails(user: User): UserDetails {
    return {
      id: user.id,
      email: user.email,
      personalData: user.personalData,
    };
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const password = await encodePassword(createUserDTO.password);
    const createdUser = new this.userModel({ ...createUserDTO, password });
    return await createdUser.save();
  }

  async findByEmail(
    authUserDTO: AuthUserDTO,
  ): Promise<UserDetails | ErrorResponse> {
    const user = await this.userModel
      .findOne({ email: authUserDTO.email })
      .exec();
    if (!user) {
      return new ErrorResponse('Invalid credentials');
    } else {
      const matched: boolean = await comparePasswords(
        authUserDTO.password,
        user.password,
      );

      if (!matched) {
        return new ErrorResponse('Invalid credentials');
      }
    }
    return this._getUserDetails(user);
  }
}
