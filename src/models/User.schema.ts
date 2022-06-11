import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: SchemaTypes.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, type: Object })
  personalData: PersonalData;
}

export type PersonalData = {
  firstName: string;
  lastName: string;
  birthday: string;
};

export const UserSchema = SchemaFactory.createForClass(User);
