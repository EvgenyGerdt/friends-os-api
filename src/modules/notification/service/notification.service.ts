import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationDocument } from '../notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async findNotificationByUserId(id: string): Promise<NotificationDocument[]> {
    return await this.notificationModel.find({ to: id }).exec();
  }

  async clearNotificationsByUserId(id: string): Promise<void> {
    await this.notificationModel.find({ to: id }).deleteMany().exec();
  }

  async createNotification(notification: NotificationDocument): Promise<void> {
    await this.notificationModel.create(notification);
  }
}
