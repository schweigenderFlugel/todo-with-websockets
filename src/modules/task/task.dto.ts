import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ITask } from './task.interface';
import { IsObjectId } from '../../common/constraints/object-id.constraint';
import { Schema } from 'mongoose';

export class TaskDto implements Omit<Omit<ITask, 'createdAt'>, 'updatedAt'> {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  timeLimit: boolean;

  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @IsNotEmpty()
  @IsArray()
  @IsObjectId()
  items: Schema.Types.ObjectId[];
}
