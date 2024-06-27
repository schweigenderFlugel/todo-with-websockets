import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Task } from '../task/task.schema';

@Schema()
export class Historial extends Document {
  @Prop({ type: Number, default: 0 })
  made: number;

  @Prop({ type: Number, default: 0 })
  succeded: number;

  @Prop({ type: Number, default: 0 })
  failed: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: Task.name }] })
  tasks: Types.Array<Task>;
}

export const HistorialSchema = SchemaFactory.createForClass(Historial);
