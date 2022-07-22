import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PersonalData } from '../../interfaces/CreateUser.dto';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, type: Object })
  personalData: PersonalData;

  @Prop({ required: false, type: Array, default: [] })
  friendList: Array<string>;

  @Prop({ required: false, type: Array, default: [] })
  friendRequests: Array<string>;

  @Prop({ required: false, type: Boolean, default: false })
  online: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
