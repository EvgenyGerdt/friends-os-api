import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Body,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { FriendsService } from '../service/friends.service';
import { AddFriendsDto } from '../../../interfaces/AddFriends.dto';
import { MessageResponse } from '../../../types/MessageResponse.type';
import { UserDetails } from '../../../types/UserDetails.type';
import { FriendList } from '../../../types/FriendList.type';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getFriendList(@Param('id') id: string): Promise<FriendList> {
    return this.friendsService.getFriendList(id);
  }

  @Post('/request')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createFriendRequest(
    @Body() request: AddFriendsDto,
  ): Promise<MessageResponse> {
    return this.friendsService.createFriendRequest(request);
  }

  @Get('/search/users')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  findUsers(@Query() query): Promise<UserDetails[]> {
    return this.friendsService.search(query.searchParam);
  }

  @Post('/accept')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  acceptFriendRequest(
    @Body() request: AddFriendsDto,
  ): Promise<MessageResponse> {
    return this.friendsService.acceptFriendRequest(request);
  }
}
