import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';

@Schema()
export class Auth extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: User | Types.ObjectId;

  @Prop({ type: String, required: true, unique: true, trim: true })
  refreshToken: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  userAgent: string;

  @Prop({ type: String, required: true, trim: true })
  ip: string;

  @Prop({ type: Date })
  lastEntry: Date;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
