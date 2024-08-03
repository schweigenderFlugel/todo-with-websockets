import { Module } from '@nestjs/common';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [RoomGateway, RoomService, JwtService],
  exports: [RoomGateway],
})
export class EventsModule {}
