import { OnModuleInit, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TodoRoomService } from './todo-room.service';
import { WebSocketExceptionFilter } from '../../common/filters/ws.filter';
import { IMessage, ServerToClientsEvents } from './todo-room.interface';
import { TaskService } from '../task/task.service';
import { WsJwtGuard, WsRolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums/roles';
import { ObjectId } from 'mongoose';

@UseGuards(WsJwtGuard, WsRolesGuard)
@UseFilters(WebSocketExceptionFilter)
@WebSocketGateway({ cors: true, namespace: '/todo-room' })
export class TodoRoomGateway implements OnModuleInit {
  @WebSocketServer() public server: Server<ServerToClientsEvents>;
  constructor(
    private readonly todoRoomService: TodoRoomService,
    private readonly taskService: TaskService,
  ) {}

  onModuleInit() {
    this.server.on('connection', (client: Socket) => {
      const { username } = client.handshake.headers;
      this.todoRoomService.onClientConnected({
        id: client.id,
        username: username as string,
      });

      this.server.emit('userList', this.todoRoomService.getClients());
      this.server.emit('roomList', this.todoRoomService.getRooms()['name']);

      client.on('disconnect', () => {
        this.todoRoomService.onClientDisconnected(client.id);
        this.server.emit('userList', this.todoRoomService.getClients());

        let isInRoom: boolean;

        this.todoRoomService.getRooms().forEach((room) =>
          room.users.forEach((user) => {
            if (user.id === client.id) isInRoom === true;
          }),
        );

        if (isInRoom) {
          this.todoRoomService.onClientLeft(client.id);
          this.server.emit('enterRoom', username as string);
        }
      });
    });
  }

  @Roles(Role.CREATOR, Role.ADMIN)
  @SubscribeMessage('createRoom')
  handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    const { username } = client.handshake.headers;
    this.todoRoomService.onRoomCreated({
      admin: username as string,
      name: room,
    });
    const rooms = this.todoRoomService.getRooms();
    this.server.emit('createRoom', username as string);
    this.server.emit('roomList', rooms['name']);
  }

  @Roles(Role.CREATOR, Role.ADMIN)
  @SubscribeMessage('removeRoom')
  handleRemoveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    const { username } = client.handshake.headers;
    this.todoRoomService.onRoomRemoved(room);
    const rooms = this.todoRoomService.getRooms();
    this.server.emit('removeRoom', username as string);
    this.server.emit('roomList', rooms['name']);
  }

  @SubscribeMessage('enterRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    const { username } = client.handshake.headers;
    const connected = this.todoRoomService.getClients();
    const prevRoom = connected.find(
      (connected) => connected.id === client.id,
    ).room;
    if (prevRoom) {
      client.leave(prevRoom);
      this.server.to(prevRoom).emit('leaveRoom', username as string);
    }
    this.todoRoomService.onClientJoined({
      id: client.id,
      room,
      username: username as string,
    });
    this.server.to(room).emit('enterRoom', username as string);
    const users = this.todoRoomService.getClientsInRoom(room);
    this.server.to(room).emit('userList', users);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    const connected = this.todoRoomService
      .getClients()
      .find((connected) => connected.id === client.id);
    client.leave(room);
    this.todoRoomService.onClientLeft(client.id);
    this.server.to(room).emit('leaveRoom', connected.username);
    const users = this.todoRoomService.getClientsInRoom(room);
    this.server.to(room).emit('userList', users);
  }

  @SubscribeMessage('roomChat')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { username: string; message: string; room?: string },
  ) {
    const { username } = client.handshake.headers;
    const message: IMessage = {
      username: username as string,
      message: payload.message,
      time: new Intl.DateTimeFormat('default', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }).format(new Date()),
    };
    this.todoRoomService.onChatHistory(payload.room, message);
    const messages = this.todoRoomService.getChatHistory(payload.room);
    this.server.to(payload.room).emit('roomChat', messages);
  }

  @Roles(Role.CREATOR, Role.ADMIN)
  @SubscribeMessage('loadTask')
  async handleLoadTask(
    @MessageBody() payload: { room: string; task: ObjectId },
  ) {
    const taskSelected = await this.taskService.selectTask(payload.task);
    const task = this.todoRoomService.onLoadTask(taskSelected);
    this.server.to(payload.room).emit('loadTask', task);
  }

  @Roles(Role.CREATOR, Role.ADMIN)
  @SubscribeMessage('taskStart')
  handleStartTask(@MessageBody() payload: { room: string; trigger: boolean }) {
    this.server.to(payload.room).emit('startTask', payload.trigger);
  }

  @SubscribeMessage('taskStatus')
  handleTaskStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() item: string,
  ) {
    const { username } = client.handshake.auth;
    this.server.emit('taskStatus', `Task has begun`);
  }

  @SubscribeMessage('taskEnd')
  handleTaskEnd() {
    console.log('Task ended');
  }
}
