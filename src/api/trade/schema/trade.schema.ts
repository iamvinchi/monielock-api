import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TradeDocument = Trade & Document;

@Schema()
export class Trade {

  @Prop({ required: true, enum:['buyer', 'seller'] })
  initiator: string;

  @Prop({ required: true, enum: ['item', 'service'] })
  category: string;

  @Prop({ required: true })
  productName: string;

  @Prop({required:true})
  amount: number;

  @Prop({required:false})
  description: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Auth' })
  owner: Types.ObjectId;

  @Prop({required:false, type: Types.ObjectId, ref: 'Trade'})
  subTrades: [Types.ObjectId]

  @Prop({required:false, type: Types.ObjectId, ref: 'Trade'})
  parentTrade: Types.ObjectId

  @Prop({required:true, enum: ['pending', 'ongoing', 'completed'], default: 'pending'})
  status: string

  @Prop({ required:false, enum: ['main', 'sub'], default: 'main'})
  tradeClass: string

  @Prop({required:false})
  image: string

  @Prop({required:false})
  quantity: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TradeSchema = SchemaFactory.createForClass(Trade);