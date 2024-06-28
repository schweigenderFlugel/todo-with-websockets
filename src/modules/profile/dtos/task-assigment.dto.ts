import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ObjectId } from 'mongoose';

export class TaskAssigmentDto {
  @IsNotEmpty()
  @IsMongoId()
  task: ObjectId;
}
