import { Module } from '@nestjs/common';
import { TodoRoomGateway } from './todo-room.gateway';
import { TodoRoomService } from './todo-room.service';
import { JwtService } from '@nestjs/jwt';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [TaskModule],
  providers: [TodoRoomGateway, TodoRoomService, JwtService],
})
export class TodoRoomModule {}
