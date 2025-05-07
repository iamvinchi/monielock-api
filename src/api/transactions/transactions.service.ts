import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { error, success } from 'src/utils/response.utils';
import { Transactions, TransactionsDocument } from './schemas/transactions.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel(Transactions.name) private transactionsModel: Model<TransactionsDocument>,
    ){}


    async walletTransactions(id:string){
        try {
            const transactions = await this.transactionsModel.find({type: 'wallet', owner: new Types.ObjectId(id)})
          return success( 
            {
              transactions
            },
            'Wallet transactions',
            'Transactions successfully retrieved.',
          );
        } catch (err) {
          return error(
            'Wallet transactions',
            `${err}`,
          );
        }
      }

      async tradeTransactions(id:string){
        try {
            const transactions = await this.transactionsModel.find({type: 'trade', owner: new Types.ObjectId(id)})
          return success( 
            {
              transactions
            },
            'Trade transactions',
            'Transactions successfully retrieved.',
          );
        } catch (err) {
          return error(
            'Trade transactions',
            `${err}`,
          );
        }
      }

      async allTransactions(id:string){
        try {
            const transactions = await this.transactionsModel.find({owner: new Types.ObjectId(id)})
          return success( 
            {
              transactions
            },
            'Transactions',
            'Transactions successfully retrieved.',
          );
        } catch (err) {
          return error(
            'Transactions',
            `${err}`,
          );
        }
      }

      async singleTransactions(id:string){
        try {
            const transaction = await this.transactionsModel.findById(id)
          return success( 
            {
              transaction
            },
            'Transaction',
            'Transaction successfully retrieved.',
          );
        } catch (err) {
          return error(
            'Transaction',
            `${err}`,
          );
        }
      }
}
