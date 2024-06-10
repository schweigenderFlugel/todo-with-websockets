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
  }

  onClientDisconnected(id: string) {
    delete this.clients[id];
  }

  getClients() {
    return Object.values(this.clients);
  }
}
