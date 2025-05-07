import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import axios from "axios"
import { error, success } from 'src/utils/response.utils';
import { AddBankDto, CreateKycDto, FundWalletDto, ResetPinDto, TagDto, UpdateBankDto, WalletWithdrawDto } from './dto/user.dto';
import { LoginDto } from '../auth/dto/auth.dto';
import { User, UserDocument } from './shemas/user.schema';
import { Wallet, WalletDocument } from './shemas/wallet.schema';
import { Bank, BankDocument } from './shemas/bank.schema';
import { Pin, PinDocument } from './shemas/pin.schema';
import { createRecipient, generateReference, getAllBanks, initiateTransfer, validateBankAccount } from 'src/utils/helper.services/paystack.service';
import { Auth, AuthDocument } from '../auth/schemas/auth.schema';
import { Transactions, TransactionsDocument } from '../transactions/schemas/transactions.schema';
import { NameTag, NameTagDocument } from './shemas/name-tag.schema';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
        @InjectModel(Bank.name) private bankModel: Model<BankDocument>,
        @InjectModel(Pin.name) private pinModel: Model<PinDocument>,
        @InjectModel(Transactions.name) private transactionsModel: Model<TransactionsDocument>,
        @InjectModel(NameTag.name) private nameTagModel: Model<NameTagDocument>,
      ) {}

      async userKyc(id:string, createKycDto: CreateKycDto){
        try {
            const {fullName, address, bankCode, accountName,accountNumber,pin} = createKycDto
            const response = await validateBankAccount({bankCode, accountName,accountNumber})

            if(response.status !== true){
                return error(
                    'User KYC error',
                    `${response.message}`,
                  );
            }

            const auth = await this.authModel.findById(id)

            const user = await this.userModel.create({
                fullName, address, auth: auth._id
            })

            const bank = await this.bankModel.create({
                bankCode,accountName,accountNumber, owner: auth._id
            })

            const newPin = await this.pinModel.create({
                pin, owner:auth._id
            })

          return success( 
            {
                user, bank, newPin
            },
            'KYC',
            'User KYC successfully',
          );
        } catch (err) {
          return error(
            'User KYC error',
            `${err}`,
          );
        }
      }

      async profile(id:string){
        try {
        
          return success( 
            {
             
            },
            'Login',
            'User successfully logged in',
          );
        } catch (err) {
          return error(
            'Login',
            `${err}`,
          );
        }
      }

      async AddBank(id:string, addBankDto: AddBankDto){
        try {
            const {bankCode,accountName,accountNumber} = addBankDto
            const response = await validateBankAccount({bankCode, accountName,accountNumber})

            if(response.status !== true){
                return error(
                    'Add bank',
                    `${response.message}`,
                  );
            }
            const auth = await this.authModel.findById(id)

            const bank = await this.bankModel.create({
                bankCode,accountName,accountNumber, owner: auth._id
            })
          return success( 
            {
              bank
            },
            'Add bank',
            'Bank successfully added',
          );
        } catch (err) {
          return error(
            'Add bank',
            `${err}`,
          );
        }
      }

      async getUserBanks(id:string){
        try {
            const banks  = await this.bankModel.find({owner: new Types.ObjectId(id)})
          return success( 
            {
             banks
            },
            'User banks',
            'User banks successfully retrieved.',
          );
        } catch (err) {
          return error(
            'User banks',
            `${err}`,
          );
        }
      }

      async getSingleBank(id:string){
        try {
            const bank  = await this.bankModel.findById(id) || null
          return success( 
            {
             bank
            },
            'User bank',
            'User bank successfully retrieved.',
          );
        } catch (err) {
          return error(
            'User bank',
            `${err}`,
          );
        }
      }

      async updateBank(id:string, updateBankDto: UpdateBankDto){
        try {
        
          return success( 
            {
              
            },
            'Login',
            'User successfully logged in',
          );
        } catch (err) {
          return error(
            'Login',
            `${err}`,
          );
        }
      }

      async deleteBank(id:string){
       
            try {
                const banks  = await this.bankModel.findByIdAndDelete(id)
              return success( 
                {
                 banks
                },
                'Delete bank',
                'Bank successfully deleted.',
              );
            } catch (err) {
              return error(
                'Delete bank',
                `${err}`,
              );
            }
      }

      async resetTransactionPin(id:string, resetPinDto: ResetPinDto){
        try {
            const {newPin} = resetPinDto          
            const foundPin  = await this.pinModel.findOne({owner: new Types.ObjectId(id)})
            if(!foundPin){
                return error(
                    'User pin',
                    `Please complete the KYC process to create a pin.`,
                  );
            }
            foundPin.pin = newPin

            foundPin.save()
          return success( 
            {},
            'Reset pin',
            'User pin successfully reset.',
          );
        } catch (err) {
          return error(
            'User pin',
            `${err}`,
          );
        }
      }
      async getWalletBalance(id:string){
        try {
            const walletBalance = await this.walletModel.findOne({owner: new Types.ObjectId(id)})
            if(!walletBalance){
                return error(
                    'Wallet',
                    `No waalet found for this account.`,
                  );
            }
          return success( 
            {
                data: walletBalance
            },
            'Wallet',
            'Wallet successfully retrieved.',
          );
        } catch (err) {
          return error(
            'Wallet',
            `${err}`,
          );
        }
      }
      async fundWallet(id:string, fundWalletDto: FundWalletDto){
        try {
            const {amount} = fundWalletDto
            const wallet = await this.walletModel.findById(id).populate<{ owner:any }>('owner').exec()
            if(!wallet){
                return error(
                    'Fund Wallet',
                    `Wallet details not found.`,
                  );
            }
            const reference = generateReference('123456789')

    const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
        //   email: wallet?.owner?.email,
        email: 'chibuikepatrick2@gmail.com',
          amount: Number(amount) * 100,
          reference,
          currency: 'NGN'
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
    await this.transactionsModel.create({
        type:'wallet',
        transactionReference: reference,
        amount: amount,
        reason: 'Fund wallet',
        status: response.data.status,
        wallet:wallet._id,
        owner: wallet.owner._id
      });
      
          return success( 
            {
                ...response.data,
                reference
            },
            'Fund wallet',
            'Fund wallet initiated.',
          );
        } catch (err) {
          return error(
            'Fund wallet',
            `${err}`,
          );
        }
      }

      async walletWithdraw(id:string, walletWithdrawDto: WalletWithdrawDto){
        try {
            const wallet = await this.walletModel.findById(id)
            const totalAmount = Number(walletWithdrawDto.amount) < 5000 ? Number(walletWithdrawDto.amount) + 100 : Number(walletWithdrawDto.amount) + 150
            if(Number(wallet.balance) < Number(totalAmount)){
                return error(
                    'Withdrawal',
                    `Insufficient balance for withdrawal.`,
                  );
            }
        const recipient = await createRecipient({
        accountName: walletWithdrawDto.accountName,
        accountNumber: walletWithdrawDto.accountNumber,
        bankCode: walletWithdrawDto.bankCode
      });
  
      const transfer = await initiateTransfer({
        amount: walletWithdrawDto.amount,
        recipientCode: recipient.recipient_code,
        reason: walletWithdrawDto.reason
      });
    await this.transactionsModel.create({
        type:'wallet',
        transactionReference: transfer.reference,
        amount: transfer.amount,
        reason: walletWithdrawDto.reason || 'withdrawal',
        status: transfer.status,
        wallet:id
      });
          return success( 
            {
                success: true,
                transferCode: transfer.transfer_code,
                reference: transfer.reference,
                status: transfer.status
            },
            'Withdrawal',
            'Withdrawal successfully',
          );
        } catch (err) {
          return error(
            'Withdrawal',
            `${err.response?.data?.message || err.message}`,
          );
        }
      }


      async createNameTag(id:string, tagDto: TagDto){
        try {
          const {tag} = tagDto
          const existingTag = await this.nameTagModel.findOne({auth: id})
          if(existingTag){
              return error(
                  'Tag',
                  `User name tag already exist.`,
                );
          }
     const user = await this.userModel.findOne({auth: new Types.ObjectId(id)})

  const createdTag = await this.nameTagModel.create({
      tag: tag.toLowerCase(),
      user: user ? user._id : null,
      auth:id
    });
        return success( 
          {
              success: true,
              tag: createdTag
          },
          'Tag',
          'Tag successfully created.',
        );
      } catch (err) {
        return error(
          'Tag',
          `${err}`,
        );
      }
      }

      async getNameTag(id:string){
        try {
          const tag = await this.nameTagModel.findOne({auth: id}).populate<{user: User}>("user").populate<{auth: Auth}>("auth").exec()
          if(!tag){
              return error(
                  'Tag',
                  `User name tag not found.`,
                );
          }

        return success( 
          {
              success: true,
              tag
          },
          'Tag',
          'Tag successfully retrieved.',
        );
      } catch (err) {
        return error(
          'Tag',
          `${err}`,
        );
      }
      }

      async validateNameTag(tagDto: TagDto){
        try {
          const tags = await this.nameTagModel.find({tag: tagDto.tag.toLowerCase()})
          if(tags?.length){
              return error(
                  'Tag',
                  `Tag not available.`,
                );
          }

        return success( 
          {
              success: true,
              tag: tagDto.tag
          },
          'Tag',
          'Tag available.',
        );
      } catch (err) {
        return error(
          'Tag',
          `${err}`,
        );
      }
      }
}
