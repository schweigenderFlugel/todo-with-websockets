import { Injectable, Inject } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { TaskModel } from './task.model';
import { TaskDto } from './task.dto';
import { ITask, ITaskModel } from './task.interface';
import { Task } from './task.schema';

@Injectable()
export class TaskService {
  constructor(@Inject(TaskModel) private readonly taskModel: ITaskModel) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.taskModel.getAllTasks();
  }

  async selectTask(id: ObjectId): Promise<Task> {
    return await this.taskModel.selectTask(id);
  }

  async createTask(userId: ObjectId, data: TaskDto): Promise<void> {
    return await this.taskModel.createTask({ userId, ...data });
  }

  async updateTask(id: ObjectId, data: Partial<ITask>): Promise<void> {
    data.updatedAt = new Date();
    return await this.taskModel.updateTask(id, data);
  }

  async deleteTask(id: ObjectId): Promise<void> {
    return await this.taskModel.deleteTask(id);
  }
}
