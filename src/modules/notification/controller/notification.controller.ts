import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from '../service/notification.service';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { NotificationDocument } from '../notification.schema';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getNotifications(@Param('id') id: string): Promise<NotificationDocument[]> {
    return this.notificationService.findNotificationByUserId(id);
  }
}
