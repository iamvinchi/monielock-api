import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pin, PinSchema } from './shemas/pin.schema';
import { Bank, BankSchema } from './shemas/bank.schema';
import { Wallet, WalletSchema } from './shemas/wallet.schema';
import { User, UserSchema } from './shemas/user.schema';
import { Auth, AuthSchema } from '../auth/schemas/auth.schema';
import { Transactions, TransactionsSchema } from '../transactions/schemas/transactions.schema';
import { NameTag, NameTagSchema } from './shemas/name-tag.schema';
import { EmailService } from 'src/utils/helper.services/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }, 
      { name: Auth.name, schema: AuthSchema }, 
      {name:Wallet.name,schema:WalletSchema},
      { name: Bank.name, schema: BankSchema }, 
      {name:Pin.name,schema:PinSchema},
      {name:Transactions.name, schema:TransactionsSchema},
      {name:NameTag.name, schema:NameTagSchema}
    ]),
  ],
  providers: [UserService, EmailService],
  controllers: [UserController]
})
export class UserModule {}
