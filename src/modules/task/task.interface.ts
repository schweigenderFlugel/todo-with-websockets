import { ObjectId } from 'mongoose';
import { Task } from './task.schema';

export interface ITask {
  title: string;
  description: string;
  timeLimit: boolean;
  limit: number;
  items: ObjectId[];
  creator: ObjectId;
  updatedAt?: Date;
}

export interface ITaskModel {
  getAllTasks(creator: ITask['creator']): Promise<Task[]>;
  selectTask(id: ObjectId): Promise<Task>;
  createTask(data: ITask): Promise<void>;
  updateTask(id: ObjectId, data: Partial<ITask>): Promise<void>;
  deleteTask(id: ObjectId): Promise<void>;
}
