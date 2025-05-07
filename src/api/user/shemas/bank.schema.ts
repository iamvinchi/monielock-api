import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BankDocument = Bank & Document;

@Schema()
export class Bank {

  @Prop({ required: true })
  bankCode: string;

  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true })
  accountName: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Auth' })
  owner: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const BankSchema = SchemaFactory.createForClass(Bank);