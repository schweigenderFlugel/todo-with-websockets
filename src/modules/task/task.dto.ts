import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ITask } from './task.interface';
import { ObjectId } from 'mongoose';

export class TaskDto
  implements Omit<Omit<Omit<ITask, 'userId'>, 'createdAt'>, 'updatedAt'>
{
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  timeLimit: boolean;

  @IsOptional()
  @IsNumber()
  limit: number;

  @IsNotEmpty()
  @IsArray()
  items: ObjectId[];
}
