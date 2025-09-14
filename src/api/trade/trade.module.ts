import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { User, UserSchema } from '../user/shemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from '../auth/schemas/auth.schema';
import { Wallet, WalletSchema } from '../user/shemas/wallet.schema';
import { Bank, BankSchema } from '../user/shemas/bank.schema';
import { Pin, PinSchema } from '../user/shemas/pin.schema';
import { Transactions, TransactionsSchema } from '../transactions/schemas/transactions.schema';
import { NameTag, NameTagSchema } from '../user/shemas/name-tag.schema';
import { Trade, TradeSchema } from './schema/trade.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }, 
      { name: Auth.name, schema: AuthSchema }, 
      {name:Wallet.name,schema:WalletSchema},
      { name: Bank.name, schema: BankSchema }, 
      {name:Pin.name,schema:PinSchema},
      {name:Transactions.name, schema:TransactionsSchema},
      {name:NameTag.name, schema:NameTagSchema},
      {name:Trade.name, schema:TradeSchema}
    ])
  ],
  controllers: [TradeController],
  providers: [TradeService]
})
export class TradeModule {}
