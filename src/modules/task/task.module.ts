import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Task, TaskSchema } from './task.schema';
import { TaskService } from './task.service';
import { TaskModel } from './task.model';
import { TaskController } from './task.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
  ],
  providers: [TaskService, TaskModel, JwtService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
