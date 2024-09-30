import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessageGateway } from './message.gateway';

@Module({
  providers: [MessageGateway, JwtService],
})
export class MessageModule {}
