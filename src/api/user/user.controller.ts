import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Response,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseAuthGuard } from 'src/utils/jwt/useAuth.guard';
import { UserService } from './user.service';
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

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('kyc')
  @UseAuthGuard()
  userKyc(@Request() req, @Body() createAuthDto: CreateKycDto) {
    const id: string = req.user.sub;
    return this.userService.userKyc(id, createAuthDto);
  }

  @Get('profile')
  @UseAuthGuard()
  profile(@Request() req) {
    const id: string = req.user.sub;
    return this.userService.profile(id);
  }

  @Post('banks')
  @UseAuthGuard()
  AddBank(@Request() req, @Body() addBank: AddBankDto) {
    const id: string = req.user.sub;
    return this.userService.AddBank(id, addBank);
  }

  @Get('banks')
  @UseAuthGuard()
  getUserBanks(@Request() req) {
    const id: string = req.user.sub;
    return this.userService.getUserBanks(id);
  }

  @Get('banks/list')
  getListOfBanks() {
    return this.userService.getListOfBanks();
  }

  @Get('bank/:id')
  @UseAuthGuard()
  getSingleBank(@Param('id') id: string) {
    return this.userService.getSingleBank(id);
  }

  @Patch('bank/:id')
  @UseAuthGuard()
  updateBank(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
    return this.userService.updateBank(id, updateBankDto);
  }

  @Delete('bank/:id')
  @UseAuthGuard()
  deleteBank(@Param('id') id: string) {
    return this.userService.deleteBank(id);
  }

  @Patch('reset-pin')
  @UseAuthGuard()
  resetTransactionPin(@Request() req, @Body() resetPinDto: ResetPinDto) {
    const id: string = req.user.sub;
    return this.userService.resetTransactionPin(id, resetPinDto);
  }

  @Get('wallet')
  @UseAuthGuard()
  getWalletBalance(@Request() req) {
    const id: string = req.user.sub;
    return this.userService.getWalletBalance(id);
  }

  @Patch('wallet/:id/fund')
  @UseAuthGuard()
  fundWallet(@Param('id') id: string) {
    return this.userService.fundWallet(id);
  }

  @Get('wallet/verify/:id/:referenceKey')
  @UseAuthGuard()
  verifyTransaction(
    @Param('id') id: string,
    @Param('referenceKey') referenceKey: string,
  ) {
    return this.userService.verifyTransaction(id, referenceKey);
  }

  @Patch('wallet/:id/withdraw')
  @UseAuthGuard()
  walletWithdraw(@Param('id') id: string, @Body() withdraw: WalletWithdrawDto) {
    return this.userService.walletWithdraw(id, withdraw);
  }

  @Post('tag')
  @UseAuthGuard()
  createNameTag(@Request() req: any, @Body() tagDto: TagDto) {
    const id = req.user.sub;
    return this.userService.createNameTag(id, tagDto);
  }

  @Get('tag')
  @UseAuthGuard()
  getNameTag(@Request() req: any) {
    const id = req.user.sub;
    return this.userService.getNameTag(id);
  }

  @Patch('tage/validate')
  validateNameTag(@Body() tagDto: TagDto) {
    return this.userService.validateNameTag(tagDto);
  }

  @Patch('tage/verify')
  verifyNameTag(@Body() tagDto: TagDto) {
    return this.userService.verifyNameTag(tagDto);
  }

  @Post('invite')
  @UseAuthGuard()
  sendInvite(@Request() req: any, @Body() inviteDto: InviteDto) {
    const id = req.user.sub;
    return this.userService.sendInvite(id, inviteDto);
  }
}
