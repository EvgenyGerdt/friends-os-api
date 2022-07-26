import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true })
  type: string;

  @Prop()
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true, type: Date, default: Date.now() })
  date: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
