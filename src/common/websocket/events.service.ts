import { Injectable } from '@nestjs/common';

interface Client {
  id: string;
  username: string;
}

@Injectable()
export class EventsService {
  private clients: Record<string, Client> = {};

  onClientConnected(client: Client) {
    this.clients[client.id] = client;
    return Object.values(this.clients);
  }

  onClientDisconnected(id: string) {
    delete this.clients[id];
    return Object.values(this.clients);
  }

  getClients() {
    return Object.values(this.clients);
  }
}
