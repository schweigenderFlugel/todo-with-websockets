import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Task } from '../task/task.schema';

@Schema()
export class Historial extends Document {
  @Prop({ type: [{ type: Types.ObjectId, ref: Task.name }] })
  made: Types.Array<Task>;

  @Prop({ type: [{ type: Types.ObjectId, ref: Task.name }] })
  succeded: Types.Array<Task>;

  @Prop({ type: [{ type: Types.ObjectId, ref: Task.name }] })
  failed: Types.Array<Task>;
}

export const HistorialSchema = SchemaFactory.createForClass(Historial);
