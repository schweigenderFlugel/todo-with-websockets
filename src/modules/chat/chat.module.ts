import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ChatGateway, ChatService, JwtService],
  exports: [ChatGateway],
})
export class EventsModule {}
