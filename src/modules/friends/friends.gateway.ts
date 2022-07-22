import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class FriendsGateway {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('FriendsGateway');

  sendRequestsInformation(to, requests) {
    this.logger.log('[UPDATE_REQUESTS] EMITTED');
    this.wss.to(to).emit('updateRequests', requests);
  }
}
