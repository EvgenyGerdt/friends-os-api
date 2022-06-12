import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { User } from '../../../models/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from '../../../dto/createUser.dto';
import { AuthUserDTO } from '../../../dto/authUser.dto';
import { comparePasswords, encodePassword } from '../../../utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResponseMessage } from '../../../types/Response.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<ResponseMessage> {
    const password = await encodePassword(createUserDTO.password);

    const isExists = await this.userModel
      .findOne({
        email: createUserDTO.email,
      })
      .exec();

    if (isExists) {
      throw new HttpException('Already exists', HttpStatus.CONFLICT);
    }

    const createdUser = new this.userModel({ ...createUserDTO, password });
    await createdUser.save();

    return {
      message: 'User created',
      statusCode: 201,
    };
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email: username }).exec();

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
    } else {
      const matched: boolean = await comparePasswords(password, user.password);

      if (!matched) {
        throw new UnauthorizedException();
      }
    }
    return user;
  }

  async login(userCandidate: AuthUserDTO) {
    console.log(userCandidate)
    return { access_token: this.jwtService.sign(userCandidate) };
  }
}
