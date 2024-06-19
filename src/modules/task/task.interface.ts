import { ObjectId } from 'mongoose';
import { Task } from './task.schema';

export interface ITask {
  userId: ObjectId;
  title: string;
  description: string;
  timeLimit: boolean;
  limit: number;
  items: ObjectId[];
  updatedAt?: Date;
}

export interface ITaskModel {
  getAllTasks(): Promise<Task[]>;
  selectTask(id: ObjectId): Promise<Task>;
  createTask(data: ITask): Promise<void>;
  updateTask(id: ObjectId, data: Partial<ITask>): Promise<void>;
  deleteTask(id: ObjectId): Promise<void>;
}
