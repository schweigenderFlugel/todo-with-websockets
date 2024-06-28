import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Task } from '../task/task.schema';
import { Historial } from '../historial/historial.schema';

@Schema({ timestamps: true })
export class Profile extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User | Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  lastname: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: Types.ObjectId, ref: Historial.name, required: true })
  historial: Historial | Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Task.name }],
    required: true,
    default: [],
  })
  tasks: Types.Array<Task> | Types.Array<Types.ObjectId>;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
