import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import { error, success } from 'src/utils/response.utils';
import {
  AddBankDto,
  CreateKycDto,
  FundWalletDto,
  InviteDto,
  ResetPinDto,
  TagDto,
  UpdateBankDto,
  WalletWithdrawDto,
} from './dto/user.dto';
import { LoginDto } from '../auth/dto/auth.dto';
import { User, UserDocument } from './shemas/user.schema';
import { Wallet, WalletDocument } from './shemas/wallet.schema';
import { Bank, BankDocument } from './shemas/bank.schema';
import { Pin, PinDocument } from './shemas/pin.schema';
import {
  createRecipient,
  generateReference,
  getAllBanks,
  initiateTransfer,
  validateBankAccount,
} from 'src/utils/helper.services/paystack.service';
import { Auth, AuthDocument } from '../auth/schemas/auth.schema';
import {
  Transactions,
  TransactionsDocument,
} from '../transactions/schemas/transactions.schema';
import { NameTag, NameTagDocument } from './shemas/name-tag.schema';
import { randomAlphanumeric, randomDigits } from 'src/utils/common.util';
import { hash } from 'src/utils/security.utils';
import { getTemplate } from 'src/utils/get-templates';
import { EmailService } from 'src/utils/helper.services/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Bank.name) private bankModel: Model<BankDocument>,
    @InjectModel(Pin.name) private pinModel: Model<PinDocument>,
    @InjectModel(Transactions.name)
    private transactionsModel: Model<TransactionsDocument>,
    @InjectModel(NameTag.name) private nameTagModel: Model<NameTagDocument>,
    private readonly emailService: EmailService,
  ) {}

  async userKyc(id: string, createKycDto: CreateKycDto) {
    try {
      const { fullName, address, bankCode, accountName, accountNumber, pin } =
        createKycDto;
      const response = await validateBankAccount({
        bankCode,
        accountName,
        accountNumber,
      });

      if (response.status !== true) {
        throw new UnprocessableEntityException(response.message);
      }

      const auth = await this.authModel.findById(id);

      const user = await this.userModel.create({
        fullName,
        address,
        auth: auth._id,
      });

      const bank = await this.bankModel.create({
        bankCode,
        accountName,
        accountNumber,
        owner: auth._id,
      });

      const newPin = await this.pinModel.create({
        pin,
        owner: auth._id,
      });

      return success(
        {
          user,
          bank,
          newPin,
        },
        'KYC',
        'User KYC successfully',
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async profile(id: string) {
    try {
      return success({}, 'Login', 'User successfully logged in');
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async AddBank(id: string, addBankDto: AddBankDto) {
    try {
      const { bankCode, accountName, accountNumber } = addBankDto;
      const response = await validateBankAccount({
        bankCode,
        accountName,
        accountNumber,
      });

      if (response.status !== true) {
        throw new UnprocessableEntityException(response.message);
      }
      const auth = await this.authModel.findById(id);

      const bank = await this.bankModel.create({
        bankCode,
        accountName,
        accountNumber,
        owner: auth._id,
      });
      return success(
        {
          bank,
        },
        'Add bank',
        'Bank successfully added',
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getUserBanks(id: string) {
    try {
      const banks = await this.bankModel.find({
        owner: new Types.ObjectId(id),
      });
      return success(
        {
          banks,
        },
        'User banks',
        'User banks successfully retrieved.',
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getSingleBank(id: string) {
    try {
      const bank = (await this.bankModel.findById(id)) || null;
      return success(
        {
          bank,
        },
        'User bank',
        'User bank successfully retrieved.',
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async updateBank(id: string, updateBankDto: UpdateBankDto) {
    try {
      return success({}, 'Login', 'User successfully logged in');
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteBank(id: string) {
    try {
      const banks = await this.bankModel.findByIdAndDelete(id);
      return success(
        {
          banks,
        },
        'Delete bank',
        'Bank successfully deleted.',
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async resetTransactionPin(id: string, resetPinDto: ResetPinDto) {
    try {
      const { newPin } = resetPinDto;
      const foundPin = await this.pinModel.findOne({
        owner: new Types.ObjectId(id),
      });
      if (!foundPin) {
        throw new BadRequestException(
          `Please complete the KYC process to create a pin.`,
        );
      }
      foundPin.pin = newPin;

      foundPin.save();
      return success({}, 'Reset pin', 'User pin successfully reset.');
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  async getWalletBalance(id: string) {
    try {
      const walletBalance = await this.walletModel.findOne({
        owner: new Types.ObjectId(id),
      });
      if (!walletBalance) {
        throw new NotFoundException(`No wallet found for this account.`);
      }
      return success(
        {
          data: walletBalance,
        },
        'Wallet',
        'Wallet successfully retrieved.',
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  async fundWallet(id: string) {
    try {
      const wallet = await this.walletModel
        .findById(id)
        .populate<{ owner: any }>('owner')
        .exec();
      if (!wallet) {
        throw new NotFoundException(`Wallet details not found.`);
      }
      const reference = generateReference('123456789');

      return success(
        {
          reference,
        },
        'Fund wallet',
        'Fund wallet initiated.',
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async verifyTransaction(id: string, referenceKey: string) {
    try {
      const wallet = await this.walletModel
        .findById(id)
        .populate<{ owner: any }>('owner')
        .exec();
      if (!wallet) {
        throw new NotFoundException(`Wallet details not found.`);
      }
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/:${referenceKey}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.status) {
        const totalAmount = Number(response.data.amount) / 100;

        const newBal = Number(wallet?.balance) + Number(totalAmount);
        await this.walletModel.findByIdAndUpdate(
          wallet?._id,
          {
            $set: {
              balance: newBal,
            },
          },
          { new: true },
        );
        await this.transactionsModel.create({
          type: 'wallet',
          transactionReference: referenceKey,
          amount: response.data.amount,
          reason: 'Fund wallet',
          status: response.data.status,
          wallet: wallet._id,
          owner: wallet.owner._id,
        });

        return success(
          {
            ...response.data,
            referenceKey,
          },
          'Fund wallet',
          'Wallet funded successfully.',
        );
      } else {
        await this.transactionsModel.create({
          type: 'wallet',
          transactionReference: referenceKey,
          amount: response?.data?.amount,
          reason: 'Fund wallet',
          status: response.data.status,
          wallet: wallet._id,
          owner: wallet.owner._id,
        });

        throw new UnprocessableEntityException('Wallet funding failed.');
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async walletWithdraw(id: string, walletWithdrawDto: WalletWithdrawDto) {
    try {
      const wallet = await this.walletModel.findById(id);
      const totalAmount =
        Number(walletWithdrawDto.amount) < 5000
          ? Number(walletWithdrawDto.amount) + 100
          : Number(walletWithdrawDto.amount) + 150;
      if (Number(wallet.balance) < Number(totalAmount)) {
        throw new BadRequestException(`Insufficient balance for withdrawal.`);
      }
      const recipient = await createRecipient({
        accountName: walletWithdrawDto.accountName,
        accountNumber: walletWithdrawDto.accountNumber,
        bankCode: walletWithdrawDto.bankCode,
      });

      const transfer = await initiateTransfer({
        amount: walletWithdrawDto.amount,
        recipientCode: recipient.recipient_code,
        reason: walletWithdrawDto.reason,
      });
      await this.transactionsModel.create({
        type: 'wallet',
        transactionReference: transfer.reference,
        amount: transfer.amount,
        reason: walletWithdrawDto.reason || 'withdrawal',
        status: transfer.status,
        wallet: id,
      });
      return success(
        {
          success: true,
          transferCode: transfer.transfer_code,
          reference: transfer.reference,
          status: transfer.status,
        },
        'Withdrawal',
        'Withdrawal successfully',
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async createNameTag(id: string, tagDto: TagDto) {
    try {
      const { tag } = tagDto;
      const existingTag = await this.nameTagModel.findOne({ auth: id });
      if (existingTag) {
        throw new ConflictException(`User name tag already exist.`);
      }
      const user = await this.userModel.findOne({
        auth: new Types.ObjectId(id),
      });

      const createdTag = await this.nameTagModel.create({
        tag: tag.toLowerCase(),
        user: user ? user._id : null,
        auth: id,
      });
      return success(
        {
          success: true,
          tag: createdTag,
        },
        'Tag',
        'Tag successfully created.',
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getNameTag(id: string) {
    try {
      const tag = await this.nameTagModel
        .findOne({ auth: id })
        .populate<{ user: User }>('user')
        .populate<{ auth: Auth }>('auth')
        .exec();
      if (!tag) {
        throw new NotFoundException(`User name tag not found.`);
      }

      return success(
        {
          success: true,
          tag,
        },
        'Tag',
        'Tag successfully retrieved.',
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async validateNameTag(tagDto: TagDto) {
    try {
      const tags = await this.nameTagModel.find({
        tag: tagDto.tag.toLowerCase(),
      });
      if (tags?.length) {
        throw new ConflictException(`Tag not available.`);
      }

      return success(
        {
          success: true,
          tag: tagDto.tag,
        },
        'Tag',
        'Tag available.',
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async verifyNameTag(tagDto: TagDto) {
    try {
      const tag = await this.nameTagModel
        .findOne({ tag: tagDto.tag.toLowerCase() })
        .populate<{ user: User }>('user');
      if (!tag) {
        throw new ConflictException(`Tag not available.`);
      }

      return success(
        {
          success: true,
          tag: tagDto.tag,
        },
        'Tag',
        'Tag available.',
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async sendInvite(id: string, inviteDto: InviteDto) {
    try {
      const { email } = inviteDto;
      const auth = await this.authModel.findOne({ email });
      if (auth) {
        throw new ConflictException(
          `An account with provided email already exist, please provide user tag.`,
        );
      }

      const user = await this.userModel.findOne({ auth: id });

      if (!user) {
        throw new BadRequestException(
          `Please update your KYC before sending an invite.`,
        );
      }

      const password = randomAlphanumeric();

      const hashedPassword = hash(password);

      const newUser = await this.authModel.create({
        email,
        password: hashedPassword,
        isVerified: true,
      });

      await this.walletModel.create({
        balance: '0',
        owner: newUser._id,
      });

      const tag = randomAlphanumeric(6);

      await this.nameTagModel.create({
        tag: tag.toLowerCase(),
        auth: newUser._id,
      });

      const msg = await getTemplate(
        'invite',
        {
          to: email,
          subject: 'Trade invite',
          name: `${email.split('@')[0]}`,
          password,
          tag,
          user: user?.fullName,
        },
        {
          escape: (html: any) => {
            return String(html);
          },
        },
      );

      await this.emailService.sendMail([email], 'Trade Invite', msg);

      return success(
        {
          tag,
        },
        'Trade invite',
        'Invite sent successfully.',
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
