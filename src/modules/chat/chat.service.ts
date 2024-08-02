import { Injectable } from '@nestjs/common';
import { IClient, IMessage, IRoom } from './chat.interface';

@Injectable()
export class ChatService {
  private clients: Record<string, IClient> = {};
  private rooms: Record<string, IRoom> = {};
  private chat: Record<number, IMessage> = {};

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
    this.rooms[client.room].users.push({ id: client.id, username: client.username })
  }

  onClientLeft(id: string) {
    this.clients[id].room = null;
    Object.values(this.rooms).forEach(room => room.users.filter(user => user.id !== id));
  }

  getClientsInRoom(name: string): IClient[] {
    const rooms = Object.values(this.rooms);
    return rooms.find(room => room.name === name).users;
  }

  onChatHistory(room: string, message: IMessage) {
    this.rooms[room].chat.push(message);
  }

  getChatHistory(name: string): IMessage[] {
    return Object.values(this.rooms).find(room => room.name === name).chat;
  }
}
