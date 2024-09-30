import { UseFilters, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketExceptionFilter } from 'src/common/filters/ws.filter';
import { JwtGuard } from 'src/common/guards';

@UseFilters(WebSocketExceptionFilter)
@UseGuards(JwtGuard)
@WebSocketGateway({ cors: true, namespace: '/message' })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    const { username, authentication } = client.handshake.headers;
    console.log(`${client.id}:${username} connected, token ${authentication}`);
  }

  handleDisconnect(client: Socket) {
    const { username, authentication } = client.handshake.headers;
    console.log(`${client.id}:${username} connected, token ${authentication}`);
  }

  @SubscribeMessage('activity')
  handleActivity(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { username: string; room?: string },
  ) {
    const { username } = client.handshake.auth;
  }
}
