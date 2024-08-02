import { OnModuleInit, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { WebSocketExceptionFilter } from '../../common/filters/ws.filter';
import { IMessage, ServerToClientsEvents } from './chat.interface';

@UseFilters(WebSocketExceptionFilter)
@WebSocketGateway({ namespace: 'chatEvents' })
export class ChatGateway implements OnModuleInit {
  @WebSocketServer() public server: Server<ServerToClientsEvents>;
  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    this.server.on('connection', (client: Socket) => {
      const { username } = client.handshake.auth;
      this.chatService.onClientConnected({ id: client.id, username: username });

      this.server.emit('userList', this.chatService.getClients());
      this.server.emit('roomsList', this.chatService.getRooms()['name']);

      client.on('disconnect', () => {
        this.chatService.onClientDisconnected(client.id);
        this.server.emit('userList', this.chatService.getClients());

        let isInRoom: boolean;

        this.chatService.getRooms().forEach(room => 
          room.users.forEach(user => {
            if (user.id === client.id) isInRoom === true;
          }
        ));

        if (isInRoom) {
          this.chatService.onClientLeft(client.id);
          this.server.emit('enterRoom', username);
        }
      }) 
    })
  }

  @SubscribeMessage('activity')
  @UseGuards(JwtGuard)
  handleActivity(
    @ConnectedSocket() client: Socket, 
    @MessageBody() payload: { username: string, room?: string }
  ) {
    const { username } = client.handshake.auth;
    if (!payload.room) {
      const connected = this.chatService.getClients();
      const target = connected.find(
        (connected) => connected.username === payload.username
      )
      if (target) this.server.to(target.id).emit('activity', `${username} is typing...`)
    }
    else {
      this.server.to(payload.room).emit('activity', `${username} is typing...`)
    }
  }

  @SubscribeMessage('sendMessage')
  @UseGuards(JwtGuard)
  handleMessage(
    @ConnectedSocket() client: Socket, 
    @MessageBody() payload: { username: string, message: string, room?: string }
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
    }
    if (!payload.room) {
      const connected = this.chatService.getClients();
      const target = connected.find(
        (connected) => connected.username === payload.username
      )
      if (target) this.server.to(target.id).emit('sendMessage', message)
    } else {
      this.chatService.onChatHistory(payload.room, message);
      const messages = this.chatService.getChatHistory(payload.room);
      this.server.to(payload.room).emit('roomChat', messages);
    }
  }

  @SubscribeMessage('createRoom')
  @UseGuards(JwtGuard)
  handleRoomCreate(
    @ConnectedSocket() client: Socket, 
    @MessageBody() room: string
  ) {
    const { username } = client.handshake.auth;
    this.chatService.onRoomCreated({ admin: username, name: room })
    const rooms = this.chatService.getRooms();
    this.server.emit('createRoom', `${username} has removed the room ${room}`)
    this.server.emit('roomsList', rooms['name']);
  }

  @SubscribeMessage('removeRoom')
  @UseGuards(JwtGuard)
  handleRoomRemove(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string
  ) {
    const { username } = client.handshake.auth;
    this.chatService.onRoomRemoved(room);
    const rooms = this.chatService.getRooms();
    this.server.emit('removeRoom', `${username} has removed the room ${room}`);
    this.server.emit('roomsList', rooms['name']);
  }

  @SubscribeMessage('enterRoom')
  @UseGuards(JwtGuard)
  handleRoomJoin(
    @ConnectedSocket() client: Socket, 
    @MessageBody() payload: { username: string, room: string }
  ) {
    const connected = this.chatService.getClients();
    const prevRoom = connected.find(
      connected => connected.id === client.id,
    ).room;
    if (prevRoom) {
      client.leave(prevRoom);
      this.server.to(prevRoom).emit('leaveRoom', payload.username);
    }
    this.chatService.onClientJoined({ id: client.id, ...payload });
    this.server.to(payload.room).emit('enterRoom', payload.username);
    const users = this.chatService.getClientsInRoom(payload.room);
    this.server.to(payload.room).emit('userList', users);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    const connected = this.chatService.getClients()
      .find(connected => connected.id === client.id);
    client.leave(room);
    this.chatService.onClientLeft(client.id);
    this.server.to(room).emit('leaveRoom', connected.username);
    const users = this.chatService.getClientsInRoom(room);
    this.server.to(room).emit('userList', users);
  }
}
