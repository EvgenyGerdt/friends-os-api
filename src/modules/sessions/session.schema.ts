import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, unique: true })
  sessionId: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
