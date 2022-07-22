import { UserDetails } from './UserDetails.type';

export type FriendList = {
  friendList: string[];
  friendRequests: Promise<UserDetails>[];
};
