import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { TaskItem, TaskItemSchema } from './schemas/task-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
      {
        name: TaskItem.name,
        schema: TaskItemSchema,
      },
    ]),
  ],
})
export class TaskModule {}
