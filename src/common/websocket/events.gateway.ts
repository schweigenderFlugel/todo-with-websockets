import { UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventsService } from './events.service';
import { JwtGuard } from '../guards/jwt.guard';
import { WebSocketExceptionFilter } from '../filters/ws.filter';

@UseFilters(WebSocketExceptionFilter)
@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  constructor(private readonly eventsService: EventsService) {}

  handleConnection(client: Socket) {
    const connected = this.eventsService.onClientDisconnected(client.id);
    this.server.emit('on-clients-changed', connected);
  }

  handleDisconnect(client: Socket) {
    const disconnected = this.eventsService.onClientDisconnected(client.id);
    this.server.emit('on-clients-changed', disconnected);
    client.disconnect();
  }

  @SubscribeMessage('signin')
  handleSignin(@ConnectedSocket() client: Socket) {
    const { username } = client.handshake.auth;
    const connected = this.eventsService.onClientConnected({
      id: client.id,
      username: username,
    });
    this.server.emit('on-clients-changed', connected);
    client.broadcast.emit('user-signed-in', `${username} has logged in`);
  }

  @SubscribeMessage('signout')
  handleSignout(@ConnectedSocket() client: Socket) {
    const { username } = client.handshake.auth;
    const disconnected = this.eventsService.onClientDisconnected(client.id);
    this.server.emit('on-clients-changed', disconnected);
    client.broadcast.emit('user-signed-out', `${username} has logged out`);
    client.disconnect();
  }

  @SubscribeMessage('chat')
  @UseGuards(JwtGuard)
  handleChat(@MessageBody() payload: { username: string; message: string }) {
    const connected = this.eventsService.getClients();
    const target = connected.find(
      (connected) => connected.username === payload.username,
    );
    if (target)
      this.server.to(target.id).emit('receive-message', payload.message);
  }

  @SubscribeMessage('todo')
  @UseGuards(JwtGuard)
  handleTodo(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const { token, username } = client.handshake.auth;
  }
}
