import { ObjectId } from 'mongoose';
import { Todo } from './todo.schema';

export interface ITodo {
  userId: ObjectId;
  made: number;
  succeded: number;
  failed: number;
}

export interface ITodoModel {
  getTodo(userId: ObjectId): Promise<Todo>;
  createTodo(userId: ObjectId): Promise<void>;
  updateTodo(
    userId: ObjectId,
    data: Partial<Omit<ITodo, 'userId'>>,
  ): Promise<void>;
}
