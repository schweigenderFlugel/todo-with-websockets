import { Document, Types } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Item extends Document {
  @Prop({ type: String, required: true })
  instruction: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Types.Array, required: true, default: [] })
  requirements: string[];

  @Prop({ type: String, required: false })
  details: string;
}
export const ItemSchema = SchemaFactory.createForClass(Item);
