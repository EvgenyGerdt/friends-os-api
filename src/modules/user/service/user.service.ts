import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { UserDocument } from '../user.schema';
import { UserDetails } from '../../../types/UserDetails.type';
import { PersonalData } from '../../../interfaces/CreateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  _getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user.id,
      email: user.email,
      personalData: user.personalData,
      online: user.online,
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this._getUserDetails(user);
  }

  async create(
    email: string,
    hashedPassword: string,
    personalData: PersonalData,
  ): Promise<UserDocument> {
    const createdUser = new this.userModel({
      email,
      password: hashedPassword,
      personalData,
    });
    return createdUser.save();
  }

  async setOnlineStatus(id: string | string[], status: boolean): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { online: status });
  }
}
