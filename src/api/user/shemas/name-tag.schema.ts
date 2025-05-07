import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NameTagDocument = NameTag & Document;

@Schema()
export class NameTag {

  @Prop({ required: true})
  tag: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Auth' })
  auth: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const NameTagSchema = SchemaFactory.createForClass(NameTag);