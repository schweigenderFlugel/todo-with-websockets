import { OnModuleInit, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { WebSocketExceptionFilter } from '../../common/filters/ws.filter';
import { IMessage, ServerToClientsEvents } from './room.interface';
import { TaskService } from '../task/task.service';
import { JwtGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums/roles';
import { ObjectId } from 'mongoose';

@UseGuards(JwtGuard, RolesGuard)
@UseFilters(WebSocketExceptionFilter)
@WebSocketGateway({ namespace: 'chatEvents' })
export class RoomGateway implements OnModuleInit {
  @WebSocketServer() public server: Server<ServerToClientsEvents>;
  constructor(
    private readonly roomService: RoomService,
    private readonly taskService: TaskService,
  ) {}

  onModuleInit() {
    this.server.on('connection', (client: Socket) => {
      const { username } = client.handshake.auth;
      this.roomService.onClientConnected({ id: client.id, username: username });

      this.server.emit('userList', this.roomService.getClients());
      this.server.emit('roomList', this.roomService.getRooms()['name']);

      client.on('disconnect', () => {
        this.roomService.onClientDisconnected(client.id);
        this.server.emit('userList', this.roomService.getClients());

        let isInRoom: boolean;

        this.roomService.getRooms().forEach((room) =>
          room.users.forEach((user) => {
            if (user.id === client.id) isInRoom === true;
          }),
        );

        if (isInRoom) {
          this.roomService.onClientLeft(client.id);
          this.server.emit('enterRoom', username);
        }
      });
    });
  }

  @SubscribeMessage('activity')
  handleActivity(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { username: string; room?: string },
  ) {
    const { username } = client.handshake.auth;
    if (!payload.room) {
      const connected = this.roomService.getClients();
      const target = connected.find(
        (connected) => connected.username === payload.username,
      );
      if (target)
        this.server.to(target.id).emit('activity', `${username} is typing...`);
    } else {
      this.server.to(payload.room).emit('activity', `${username} is typing...`);
    }
  }

  @SubscribeMessage('sendMessage')
  sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { username: string; message: string; room?: string },
  ) {
    const { username } = client.handshake.auth;
    const message: IMessage = {
      username: username,
      message: payload.message,
      time: new Intl.DateTimeFormat('default', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }).format(new Date()),
    };
    if (!payload.room) {
      const connected = this.roomService.getClients();
      const target = connected.find(
        (connected) => connected.username === payload.username,
      );
      if (target) this.server.to(target.id).emit('sendMessage', message);
    } else {
      this.roomService.onChatHistory(payload.room, message);
      const messages = this.roomService.getChatHistory(payload.room);
      this.server.to(payload.room).emit('roomChat', messages);
    }
  }

  @Roles(Role.CREATOR, Role.ADMIN)
  @SubscribeMessage('createRoom')
  createRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    const { username } = client.handshake.auth;
    this.roomService.onRoomCreated({ admin: username, name: room });
    const rooms = this.roomService.getRooms();
    this.server.emit('createRoom', username);
    this.server.emit('roomList', rooms['name']);
  }

  @Roles(Role.CREATOR, Role.ADMIN)
  @SubscribeMessage('removeRoom')
  removeRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    const { username } = client.handshake.auth;
    this.roomService.onRoomRemoved(room);
    const rooms = this.roomService.getRooms();
    this.server.emit('removeRoom', username);
    this.server.emit('roomList', rooms['name']);
  }

  @SubscribeMessage('enterRoom')
  joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { username: string; room: string },
  ) {
    const connected = this.roomService.getClients();
    const prevRoom = connected.find(
      (connected) => connected.id === client.id,
    ).room;
    if (prevRoom) {
      client.leave(prevRoom);
      this.server.to(prevRoom).emit('leaveRoom', payload.username);
    }
    this.roomService.onClientJoined({ id: client.id, ...payload });
    this.server.to(payload.room).emit('enterRoom', payload.username);
    const users = this.roomService.getClientsInRoom(payload.room);
    this.server.to(payload.room).emit('userList', users);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    const connected = this.roomService
      .getClients()
      .find((connected) => connected.id === client.id);
    client.leave(room);
    this.roomService.onClientLeft(client.id);
    this.server.to(room).emit('leaveRoom', connected.username);
    const users = this.roomService.getClientsInRoom(room);
    this.server.to(room).emit('userList', users);
  }

  @Roles(Role.CREATOR, Role.ADMIN)
  @SubscribeMessage('loadTask')
  async loadTask(@MessageBody() payload: { room: string; task: ObjectId }) {
    const taskSelected = await this.taskService.selectTask(payload.task);
    const task = this.roomService.onLoadTask(taskSelected);
    this.server.to(payload.room).emit('loadTask', task);
  }

  @Roles(Role.CREATOR, Role.ADMIN)
  @SubscribeMessage('startTask')
  startTask(@MessageBody() payload: { room: string; trigger: boolean }) {
    this.server.to(payload.room).emit('startTask', payload.trigger);
  }

  @SubscribeMessage('taskStatus')
  handleItemStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() item: string,
  ) {
    const { username } = client.handshake.auth;
    this.server.emit('taskStatus', `Task has begun`);
  }
}
