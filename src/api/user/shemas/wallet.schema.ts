import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {

@Prop({ default: "normal" })
  type: string;

  @Prop({ required: true })
  balance: string;

  @Prop({ required: false })
  currentRef:string

  @Prop({ required: true, type: Types.ObjectId, ref: 'Auth' })
  owner: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);