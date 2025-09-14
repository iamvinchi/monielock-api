import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import axios from "axios"
import { error, success } from 'src/utils/response.utils';
// import { User, UserDocument } from './shemas/user.schema';
import { Wallet, WalletDocument } from '../user/shemas/wallet.schema';
// import { Bank, BankDocument } from './shemas/bank.schema';
// import { Pin, PinDocument } from './shemas/pin.schema';
import { createRecipient, generateReference, getAllBanks, initiateTransfer, validateBankAccount } from 'src/utils/helper.services/paystack.service';
import { Auth, AuthDocument } from '../auth/schemas/auth.schema';
import { Transactions, TransactionsDocument } from '../transactions/schemas/transactions.schema';
import { Trade, TradeDocument } from './schema/trade.schema';
import { AddSubTradeDto, CreateTradeDto, UpdateTradeDto } from './dto/trade.dto';
import { NameTag, NameTagDocument } from '../user/shemas/name-tag.schema';


@Injectable()
export class TradeService {
    constructor(
        @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
        // @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
        // @InjectModel(Bank.name) private bankModel: Model<BankDocument>,
        @InjectModel(Trade.name) private tradeModel: Model<TradeDocument>,
        @InjectModel(Transactions.name) private transactionsModel: Model<TransactionsDocument>,
        @InjectModel(NameTag.name) private nameTagModel: Model<NameTagDocument>,
      ) {}

      async createTrade(id:string, createTradeDto: CreateTradeDto){
        try {
            const {initiator, category, productName, amount,description,tag, image, quantity} = createTradeDto

           const tagName = await this.nameTagModel.findOne({tag:tag.toLowerCase()}).populate<{ auth:any }>('auth').exec()

           if(!tagName){
            return error(
                'Create trade',
                `User with provided tag not found`,
              );
           }

           if(initiator === "buyer"){
            const wallet = await this.walletModel.findOne({owner: tagName?.auth?._id})
            if(wallet.balance < amount){
                return error(
                    'Create trade',
                    `Insufficient balance, please fund wallet.`,
                  );
            }
            const bal = Number(wallet.balance) - Number(amount)
            wallet.balance = bal.toString()
            wallet.save()
           }

            const trade = await this.tradeModel.create({
                initiator, 
                category, 
                productName, 
                amount,
                description,
                owner: tagName?.auth?._id, 
                image, 
                quantity
            })

          return success( 
            {
                trade
            },
            'Create trade',
            'Trade created successfully',
          );
        } catch (err) {
          return error(
            'Create trade',
            `${err}`,
          );
        }
      }

      async getAllTades(id:string){
        try {
            const trades  = await this.tradeModel.find({owner: new Types.ObjectId(id)})
          return success( 
            {
             trades
            },
            'User trades',
            'User trades successfully retrieved.',
          );
        } catch (err) {
          return error(
            'User trades',
            `${err}`,
          );
        }
      }

      async getTradeById(id:string){
        try {
            const trade  = await this.tradeModel.findById(id) || null
          return success( 
            {
             trade
            },
            'User trade',
            'User trade successfully retrieved.',
          );
        } catch (err) {
          return error(
            'User trade',
            `${err}`,
          );
        }
      }

      async updateTrade(id:string, updateTradeDto: UpdateTradeDto){
        try {
        
          return success( 
            {
              
            },
            'Update trade',
            'Trade updated',
          );
        } catch (err) {
          return error(
            'Update trade',
            `${err}`,
          );
        }
      }

      async deleteTrade(id:string){
       
            try {
                const banks  = await this.tradeModel.findByIdAndDelete(id)
              return success( 
                {
                 banks
                },
                'Delete trade',
                'Trade successfully deleted.',
              );
            } catch (err) {
              return error(
                'Delete trade',
                `${err}`,
              );
            }
      }

      async acceptTrade(id:string, userId:string){
        try {
                  
            const foundTrade  = await this.tradeModel.findOne({_id: new Types.ObjectId(id)})
            if(!foundTrade){
                return error(
                    'Accept trade',
                    `Trade not found.`,
                  );
            }
            
            if(foundTrade.initiator === "seller"){
                const wallet = await this.walletModel.findOne({owner: userId})
                if(Number(wallet.balance) < Number(foundTrade.amount)){
                    return error(
                        'Accept trade',
                        `Insufficient balance, please fund wallet.`,
                      );
                }
                const bal = Number(wallet.balance) - Number(foundTrade.amount)
                wallet.balance = bal.toString()
                wallet.save()
               }

            foundTrade.status = "ongoing"

            foundTrade.save()
          return success( 
            {},
            'Accept trade',
            'Trade accepted successfully.',
          );
        } catch (err) {
          return error(
            'Accept trade',
            `${err}`,
          );
        }
      }
      async completeTrade(id:string){
        try {
            const trade = await this.tradeModel.findOne({owner: new Types.ObjectId(id)})
            if(!trade){
                return error(
                    'Complete trade',
                    `Trade not found.`,
                  );
            }
            // some logic here
            trade.status = "completed"
            trade.save()
          return success( 
            {
                trade
            },
            'Complete trade',
            'Trade successfully completed.',
          );
        } catch (err) {
          return error(
            'Complete trade',
            `${err}`,
          );
        }
      }
      
    //   async addSubTrade(id:string, addSubTradeDto: AddSubTradeDto){
    //     try {
    //         const {tradeId, initiator, category, productName, amount,description,tag, image, quantity} = addSubTradeDto

    //         const trade = await this.tradeModel.findById( new Types.ObjectId(tradeId))


    //         const wallet = await this.walletModel.findById(id).populate<{ owner:any }>('owner').exec()
    //         if(!wallet){
    //             return error(
    //                 'Sub trade',
    //                 ``,
    //               );
    //         }
            
    
      
    //       return success( 
    //         {},
    //         'Sub trade',
    //         'Successfully added sub trade.',
    //       );
    //     } catch (err) {
    //       return error(
    //         'Sub trade',
    //         `${err}`,
    //       );
    //     }
    //   }

     
}

