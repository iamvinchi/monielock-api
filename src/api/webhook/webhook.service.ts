import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { error, success } from 'src/utils/response.utils';
import { Wallet, WalletDocument } from '../user/shemas/wallet.schema';
import { Model } from 'mongoose';
import { refundCustomer } from 'src/utils/helper.services/paystack.service';
import crypto from 'crypto'
import { Transactions, TransactionsDocument } from '../transactions/schemas/transactions.schema';

@Injectable()
export class WebhookService {
    constructor(
        @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
        @InjectModel(Transactions.name) private transactionModel: Model<TransactionsDocument>,
    ) { }

    async creditWallet(req: any, res: any) {
        try {
            console.log({ res })
            console.log({ req })
            const { body } = req
            console.log({ body })
            return success(
                {
                    body
                },
                'Webhook',
                'Wallet credited',
            );
        } catch (err) {
            return error(
                'Webhook',
                `${err}`,
            );
        }
    }

    async withdrawal(req: any, res: any) {
        const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash !== req.headers['x-paystack-signature']) {
            return res.status(401).send('Unauthorized');
        }

        const event = req.body;

        const trns = await this.transactionModel.findOne({ transactionReference: event.data.reference }).populate<{ wallet: any }>('wallet').exec()

        if (event.event === 'transfer.success') {
            const totalAmount = (Number(event.data.amount) / 100) < 5000 ? (Number(event.data.amount /100) / 100) + 100 : (Number(event.data.amount) / 100) + 150

            const currentBal = Number(trns?.wallet?.balance) - Number(totalAmount)
            await this.walletModel.findByIdAndUpdate(
                trns?.wallet?._id,
                {
                    $set: {
                        balance: currentBal
                    }
                },
                { new: true }
            );
            return await this.transactionModel.findByIdAndUpdate(
                trns._id,
                {
                    $set: {
                        transactionReference: event.data.reference,
                        status: 'success'
                    }
                },
                { new: true }
            );

        }
        else if (event.event === 'transfer.failed') {
            await this.transactionModel.findByIdAndUpdate(
                trns._id,
                {
                    $set: {
                        transactionReference: event.data.reference,
                        status: 'failed'
                    }
                },
                { new: true }
            );
            await refundCustomer(event.data);
        }
        else if (event.event === 'transfer.reversed') {
            return await this.transactionModel.findByIdAndUpdate(
                trns._id,
                {
                    $set: {
                        transactionReference: event.data.reference,
                        status: 'reversed'
                    }
                },
                { new: true }
            )
        }

        res.status(200).send('Webhook received');

    }
}
