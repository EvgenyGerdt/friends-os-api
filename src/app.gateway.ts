import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserService } from './modules/user/service/user.service';
import { SessionService } from './modules/sessions/service/session.service';
import { NotificationService } from './modules/notification/service/notification.service';
import { NotificationDocument } from './modules/notification/notification.schema';

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private notificationService: NotificationService,
  ) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('FriendOSGateway');

  afterInit(server: Server): any {
    this.logger.log('FriendsOS Gateway initialized.');
  }

  @SubscribeMessage('sendNotification')
  async handleNotification(
    client: Socket,
    payload: NotificationDocument,
  ): Promise<void> {
    const session = await this.sessionService.findSessionByUserId(payload.to);

    await this.notificationService.createNotification(payload);

    this.server
      .in(session.sessionId)
      .emit('sendNotificationClient', { payload: payload });
  }

  @SubscribeMessage('clearNotifications')
  async handleClearNotifications(
    client: Socket,
    payload: string,
  ): Promise<void> {
    const session = await this.sessionService.findSessionByUserId(payload);
    await this.notificationService.clearNotificationsByUserId(payload);

    this.server.in(session.sessionId).emit('clearNotificationsClient');
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    this.logger.log(`Client connected: ${client.id}`);

    try {
      await this.sessionService.create({
        sessionId: client.id,
        userId: client.handshake.query.id,
      });
      await this.userService.setOnlineStatus(client.handshake.query.id, true);
    } catch (e) {
      this.logger.error(e);
    }

    this.server.socketsJoin(client.handshake.query.id);

    client.emit('session', { sessionID: client.id });
  }

  async handleDisconnect(client: Socket): Promise<any> {
    this.logger.log(`Client disconnected: ${client.id}`);

    try {
      const session = await this.sessionService.delete(client.id);
      await this.userService.setOnlineStatus(session.userId, false);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
