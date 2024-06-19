import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ITask, ITaskModel } from './task.interface';
import { Task } from './task.schema';

@Injectable()
export class TaskModel implements ITaskModel {
  constructor(@InjectModel(Task.name) private readonly model: Model<Task>) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.model.find().select('title');
  }

  async selectTask(id: ObjectId): Promise<Task> {
    return await this.model.findById(id);
  }

  async createTask(data: ITask): Promise<void> {
    const newTask = await this.model.create(data);
    newTask.save();
  }

  async updateTask(id: ObjectId, data: Partial<ITask>): Promise<void> {
    return await this.model.findByIdAndUpdate(id, data);
  }

  async deleteTask(id: ObjectId): Promise<void> {
    return await this.model.findByIdAndDelete(id);
  }
}
