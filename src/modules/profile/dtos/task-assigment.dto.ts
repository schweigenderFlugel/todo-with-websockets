import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';
import { IsObjectId } from 'src/common/constraints/object-id.constraint';

export class TaskAssigmentDto {
  @IsNotEmpty()
  @IsObjectId()
  task: ObjectId;
}
