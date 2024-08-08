import { Module } from '@nestjs/common';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';
import { JwtService } from '@nestjs/jwt';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [TaskModule],
  providers: [RoomGateway, RoomService, JwtService],
  exports: [RoomGateway],
})
export class EventsModule {}
