import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Item } from '../item/item.schema';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Boolean, required: true })
  timeLimit: boolean;

  @Prop({ type: Number, required: false })
  limit: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: Item.name }], required: true })
  items: Types.Array<Item>;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
