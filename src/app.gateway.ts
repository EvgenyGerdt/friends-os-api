import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { UserService } from './modules/user/service/user.service';
import { SessionService } from './modules/sessions/service/session.service';

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
  ) {}

  private logger: Logger = new Logger('FriendOSGateway');

  afterInit(server: Server): any {
    this.logger.log('FriendsOS Gateway initialized.');
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
