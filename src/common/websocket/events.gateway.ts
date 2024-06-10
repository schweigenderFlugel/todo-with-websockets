import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventsService } from './events.service';
import { JwtGuardWithWs } from '../guards/jwt-websocket.guard';

@UseGuards(JwtGuardWithWs)
@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer() public server: Server;
  constructor(private readonly eventsService: EventsService) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    const { token, username } = client.handshake.auth;
    this.server.emit('connection', `${username} is connected`);
    if (!username) {
      client.disconnect();
      this.eventsService.onClientDisconnected(client.id);
      this.server.emit('disconnection', `${username} disconnected!`);
    }

    this.eventsService.onClientConnected({ id: client.id, username: username });
  }

  @SubscribeMessage('signin')
  handleSignin(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
    const { token, username } = client.handshake.auth;
    if (!username) {
      this.eventsService.onClientDisconnected(client.id);
      client.disconnect();
    }

    this.eventsService.onClientConnected({ id: client.id, username: username });
  }

  @SubscribeMessage('chat')
  handleChat(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const { token, username } = client.handshake.auth;
    if (!username) {
      this.eventsService.onClientDisconnected(client.id);
      client.disconnect();
    }
  }

  @SubscribeMessage('todo')
  handleTodo(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const { token, username } = client.handshake.auth;
    if (!username) {
      this.eventsService.onClientDisconnected(client.id);
      client.disconnect();
    }
  }
}
