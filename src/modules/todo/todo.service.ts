import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ITodo, ITodoModel } from './todo.interface';
import { TodoModel } from './todo.model';

@Injectable()
export class TodoService {
  constructor(@Inject(TodoModel) private readonly todoModel: ITodoModel) {}

  async createTodo(data: ITodo): Promise<void> {
    return await this.todoModel.createTodo(data);
  }

  async updateTodo(userId: ObjectId, data: Partial<Omit<ITodo, 'userId'>>) {
    const todoFound = await this.todoModel.getTodo(userId);
    if (!todoFound) throw new NotFoundException('todo not found!');
    let payload: Partial<ITodo>;
    if (data.succeded) {
      payload = {
        made: todoFound.made + 1,
        succeded: todoFound.succeded + 1,
      };
    } else if (data.failed) {
      payload = {
        made: todoFound.made + 1,
        failed: todoFound.failed + 1,
      };
    }
    return await this.todoModel.updateTodo(userId, payload);
  }
}
