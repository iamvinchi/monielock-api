import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionsDocument = Transactions & Document;

@Schema()
export class Transactions {

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  transactionReference: string;

  @Prop({ required:false })
  amount: string;

  @Prop({ required:true })
  status: string;

  @Prop({ required:false })
  reason: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Wallet' })
  wallet: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Auth' })
  owner: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TransactionsSchema = SchemaFactory.createForClass(Transactions);