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

  @Prop({ type: String, required: true, trim: true, default: null })
  activationCode: string | null;

  @Prop({ type: Boolean, required: true, default: false })
  active: boolean;

  @Prop({ type: String, required: true, enum: Role, default: Role.NORMAL })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
