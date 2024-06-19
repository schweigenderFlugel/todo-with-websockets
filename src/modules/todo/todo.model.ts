import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ITodo, ITodoModel } from './todo.interface';
import { Todo } from './todo.schema';

@Injectable()
export class TodoModel implements ITodoModel {
  constructor(@InjectModel(Model.name) private readonly model: Model<Todo>) {}

  async getTodo(userId: ObjectId): Promise<Todo> {
    return await this.model.findOne({ userId: userId });
  }

  async createTodo(userId: ObjectId): Promise<void> {
    const newTodo = await this.model.create({ userId });
    newTodo.save();
  }

  async updateTodo(
    userId: ObjectId,
    data: Partial<Omit<ITodo, 'userId'>>,
  ): Promise<void> {
    await this.model.findOneAndUpdate(userId, data);
  }
}
