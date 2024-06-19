import { Document, Types } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { Item } from 'src/modules/item/item.schema';

@Schema()
export class TaskItem extends Document {
  @Prop({ type: Types.ObjectId, ref: Task.name, required: true })
  taskId: Task | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Item.name, required: true })
  itemId: Item | Types.ObjectId;
}
export const TaskItemSchema = SchemaFactory.createForClass(TaskItem);
