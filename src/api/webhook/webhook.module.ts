import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from '../user/shemas/wallet.schema';
import { Transactions, TransactionsSchema } from '../transactions/schemas/transactions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name:Wallet.name,schema:WalletSchema}, {name:Transactions.name, schema:TransactionsSchema}]),
  ],
  providers: [WebhookService],
  controllers: [WebhookController]
})
export class WebhookModule {}
