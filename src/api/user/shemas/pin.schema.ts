import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PinDocument = Pin & Document;

@Schema()
export class Pin {

  @Prop({ required: true })
  pin: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Auth' })
  owner: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PinSchema = SchemaFactory.createForClass(Pin);