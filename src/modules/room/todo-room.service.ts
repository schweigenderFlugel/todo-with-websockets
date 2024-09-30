import { Injectable } from '@nestjs/common';
import { IClient, IMessage, IRoom, IRoomTask } from './todo-room.interface';
import { Task } from '../task/task.schema';

@Injectable()
export class TodoRoomService {
  private clients: Record<string, IClient> = {};
  private rooms: Record<string, IRoom> = {};
  private roomTask: Record<string, IRoomTask> = {};

  onClientConnected(client: IClient) {
    this.clients[client.id] = client;
  }

  onClientDisconnected(id: string) {
    delete this.clients[id];
  }

  getClients() {
    return Object.values(this.clients);
  }

  onRoomCreated(room: IRoom) {
    this.rooms[room.name] = room;
  }

  onRoomRemoved(name: string) {
    delete this.rooms[name];
  }

  getRooms(): IRoom[] {
    const rooms = Object.values(this.rooms);
    return rooms;
  }

  onClientJoined(client: IClient) {
    this.clients[client.id].room = client.room;
    this.rooms[client.room].users.push({
      id: client.id,
      username: client.username,
    });
  }

  onClientLeft(id: string) {
    this.clients[id].room = null;
    Object.values(this.rooms).forEach((room) =>
      room.users.filter((user) => user.id !== id),
    );
  }

  getClientsInRoom(name: string): IClient[] {
    const rooms = Object.values(this.rooms);
    return rooms.find((room) => room.name === name).users;
  }

  onChatHistory(room: string, message: IMessage) {
    this.rooms[room].chat.push(message);
  }

  getChatHistory(name: string): IMessage[] {
    return Object.values(this.rooms).find((room) => room.name === name).chat;
  }

  onLoadTask(task: Task) {
    return this.roomTask[task.title];
  }
}
