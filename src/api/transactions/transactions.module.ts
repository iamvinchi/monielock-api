import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transactions, TransactionsSchema } from './schemas/transactions.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[
    MongooseModule.forFeature([{name: Transactions.name, schema: TransactionsSchema}])
    ],
  providers: [TransactionsService],
  controllers: [TransactionsController]
})
export class TransactionsModule {}
