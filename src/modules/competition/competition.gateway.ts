import { UseFilters, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketExceptionFilter } from 'src/common/filters/ws.filter';
import { JwtGuard } from 'src/common/guards';

@UseFilters(WebSocketExceptionFilter)
@UseGuards(JwtGuard)
@WebSocketGateway()
export class CompetitionGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('enter-task-room')
  async handleEnterRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    const { username } = client.handshake.auth;
    client.join(room);
    client.emit('enter-task-room', `${username} has joined to this task room`);
  }

  @SubscribeMessage('enter-task-room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    const { username } = client.handshake.auth;
    client.leave(room);
    client.emit('enter-task-room', `${username} leave this task room`);
  }

  @SubscribeMessage('task-start')
  async handleStart(@MessageBody() task: string) {
    this.server.emit('task-start', `Task "${task}" has begun`);
  }

  @SubscribeMessage('item-completed')
  async handleItemCompleted(
    @ConnectedSocket() client: Socket,
    @MessageBody() item: string,
  ) {
    const { username } = client.handshake.auth;
    client.broadcast.emit(
      'item-completed',
      `${username} has finished item: ${item}`,
    );
  }

  @SubscribeMessage('item-start')
  async handleItemStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() item: string,
  ) {
    const { username } = client.handshake.auth;
    client.broadcast.emit('item-start', `${username} is making item: ${item}`);
  }

  @SubscribeMessage('task-completed')
  async handleTaskCompleted(
    @ConnectedSocket() client: Socket,
    @MessageBody() task: string,
  ) {
    const { username } = client.handshake.auth;
    client.broadcast.emit(
      'item-completed',
      `${username} has completed task: ${task}`,
    );
  }
}
