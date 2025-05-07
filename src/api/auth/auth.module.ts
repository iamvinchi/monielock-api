import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './schemas/auth.schema';
import { Wallet, WalletSchema } from '../user/shemas/wallet.schema';
import { Authutil } from 'src/utils/auth.utils';
import { EmailService } from 'src/utils/helper.services/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }, {name:Wallet.name,schema:WalletSchema}]),
  ],
  providers: [AuthService, Authutil, EmailService],
  exports: [AuthService], 
  controllers: [AuthController]
})
export class AuthModule {}
