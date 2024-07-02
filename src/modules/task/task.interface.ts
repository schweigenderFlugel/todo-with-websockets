import { ObjectId } from 'mongoose';
import { Task } from './task.schema';

export interface ITask {
  title: string;
  description: string;
  timeLimit: boolean;
  limit: number;
  items: ObjectId[];
  user?: ObjectId;
  updatedAt?: Date;
}

export interface ITaskModel {
  getAllTasks(): Promise<Task[]>;
  selectTask(id: ObjectId): Promise<Task>;
  createTask(data: ITask): Promise<void>;
  updateTask(
    id: ObjectId,
    data: Partial<ITask>,
    assignment?: boolean,
  ): Promise<void>;
  deleteTask(id: ObjectId): Promise<void>;
}
