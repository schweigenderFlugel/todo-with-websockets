import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Hola, te saluda ${client}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`${client} dice adiós`);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: string) {
    console.log(message);
  }
}
