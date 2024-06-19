import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from '../profile/profile.schema';
import { Task } from '../task/task.schema';

@Schema()
export class Todo extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: Profile.name })
  userId: Profile | Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: Task.name }] })
  tasks: Types.Array<Task>;

  @Prop({ type: Number, default: 0 })
  made: number;

  @Prop({ type: Number, default: 0 })
  succeded: number;

  @Prop({ type: Number, default: 0 })
  failed: number;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
