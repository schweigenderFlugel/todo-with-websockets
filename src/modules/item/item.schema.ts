import { Document } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

enum ChallengeTypes {}

@Schema()
export class Item extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: ChallengeTypes, required: true })
  type: ChallengeTypes;
}
export const ItemSchema = SchemaFactory.createForClass(Item);
