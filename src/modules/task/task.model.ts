import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ITask, ITaskModel } from './task.interface';
import { Task } from './task.schema';
import { Item } from '../item/item.schema';
import { User } from '../user/user.schema';

@Injectable()
export class TaskModel implements ITaskModel {
  constructor(@InjectModel(Task.name) private readonly model: Model<Task>) {}

  async getAllTasks(creator: ObjectId): Promise<Task[]> {
    return await this.model
      .find({ creator: creator })
      .populate({ path: 'creator', model: User.name, select: 'username' })
      .exec();
  }

  async selectTask(id: ObjectId): Promise<Task> {
    return await this.model
      .findById(id)
      .populate({ path: 'items', model: Item.name })
      .exec();
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
