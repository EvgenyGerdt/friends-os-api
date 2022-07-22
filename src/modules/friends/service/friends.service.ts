import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { UserDocument } from '../../user/user.schema';
import { AddFriendsDto } from '../../../interfaces/AddFriends.dto';
import { MessageResponse } from '../../../types/MessageResponse.type';
import { UserDetails } from '../../../types/UserDetails.type';
import { FriendList } from '../../../types/FriendList.type';
import { SessionDocument } from '../../sessions/session.schema';
import { FriendsGateway } from '../friends.gateway';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @InjectModel('Session')
    private readonly sessionModel: Model<SessionDocument>,
    private friendsGateway: FriendsGateway,
  ) {}

  _getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user.id,
      email: user.email,
      personalData: user.personalData,
      online: user.online,
    };
  }

  async getFriendList(id: string): Promise<FriendList> {
    const user = await this.userModel.findById(id).exec();

    let friendRequestsData: any = [];
    let friendListData: any = [];

    if (user.friendRequests) {
      friendRequestsData = await this.userModel
        .find({ _id: { $in: user.friendRequests } })
        .exec();
    }

    if (user.friendList) {
      friendListData = await this.userModel
        .find({ _id: { $in: user.friendList } })
        .exec();
    }

    return {
      friendList: friendListData.map(this._getUserDetails) || [],
      friendRequests: friendRequestsData.map(this._getUserDetails) || [],
    };
  }

  async createFriendRequest(request: AddFriendsDto): Promise<MessageResponse> {
    const user = await this.userModel
      .findByIdAndUpdate(request.to, {
        $push: { friendRequests: request.from },
      })
      .exec();

    const session = await this.sessionModel.findOne({ id: request.to }).exec();

    this.friendsGateway.sendRequestsInformation(
      session.sessionId,
      user.friendRequests,
    );

    return { message: 'Success friend request' };
  }

  async acceptFriendRequest(request: AddFriendsDto): Promise<MessageResponse> {
    await this.userModel
      .findByIdAndUpdate(request.to, { $push: { friendList: request.from } })
      .exec();
    await this.userModel
      .findById(request.from, { $push: { friendList: request.to } })
      .exec();
    await this.userModel
      .findByIdAndUpdate(request.to, {
        $pull: { friendRequests: request.from },
      })
      .exec();

    return { message: 'Friend requests accepted' };
  }

  async search(searchParam: string): Promise<UserDetails[]> {
    return this.userModel.find({
      $or: [
        { 'personalData.firstName': searchParam },
        { 'personalData.lastName': searchParam },
      ],
    });
  }
}
