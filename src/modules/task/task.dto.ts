import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  IsMongoId,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { ITask } from './task.interface';
import { ObjectId } from 'mongoose';
import { Type } from 'class-transformer';

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
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @IsMongoId({ each: true })
  items: ObjectId[];
}
