import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/enums/roles';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true, unique: true, trim: true })
  username: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  email: string;

  @Prop({ type: String, required: true, trim: true })
  password: string;

  @Prop({ type: String, required: true, default: Role.NORMAL })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
