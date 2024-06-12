import {
  ArgumentsHost,
  Catch,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
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
import { JwtGuard } from '../guards/jwt.guard';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer() public server: Server;
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtGuard)
  handleConnection(@ConnectedSocket() client: Socket) {
    const { username } = client.handshake.auth;
    try {
      this.server.emit('connection', `${username} is connected`);
      this.eventsService.onClientConnected({
        id: client.id,
        username: username,
      });
    } catch (error) {
      console.log(error);
      client.disconnect();
      this.eventsService.onClientDisconnected(client.id);
      this.server.emit('disconnection', `${username} disconnected!`);
    }
  }

  @SubscribeMessage('signin')
  handleSignin(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
    try {
      const { token, username } = client.handshake.auth;
      this.server.emit('connection', `${username} is connected`);
      this.eventsService.onClientConnected({
        id: client.id,
        username: username,
      });
    } catch (error) {
      client.disconnect();
      this.eventsService.onClientDisconnected(client.id);
      this.server.emit('disconnection', `bla disconnected!`);
    }
  }

  @SubscribeMessage('chat')
  @UseGuards(JwtGuard)
  handleChat(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    try {
      const { token, username } = client.handshake.auth;
      this.server.emit('response', `${username} says ${data['message']}`);
      this.eventsService.onClientConnected({
        id: client.id,
        username: username,
      });
    } catch (error) {
      console.log(error);
      client.disconnect();
      this.eventsService.onClientDisconnected(client.id);
      this.server.emit('disconnection', `bla disconnected!`);
    }
  }

  @SubscribeMessage('todo')
  @UseGuards(JwtGuard)
  handleTodo(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const { token, username } = client.handshake.auth;
    if (!username) {
      this.eventsService.onClientDisconnected(client.id);
      client.disconnect();
    }
  }
}
