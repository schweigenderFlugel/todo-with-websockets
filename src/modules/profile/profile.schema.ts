import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';

@Schema()
export class Profile extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: User | Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  lastname: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const ProfiileSchema = SchemaFactory.createForClass(Profile);
