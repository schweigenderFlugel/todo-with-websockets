import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Item } from '../item/item.schema';
import { ChallengeType } from './challenge-type.enum';
import { Profile } from '../profile/profile.schema';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  challengeType: ChallengeType;

  @Prop({ type: Boolean, required: true })
  timeLimit: boolean;

  @Prop({ type: Number, required: false })
  limit: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: Item.name }], required: true })
  items: Types.Array<Item> | Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: Profile.name }],
    required: false,
    default: [],
  })
  users: Types.Array<Profile> | Types.ObjectId[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
