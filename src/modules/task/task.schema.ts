import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Item } from '../item/item.schema';
import { User } from '../user/user.schema';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: User | Types.ObjectId;

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
