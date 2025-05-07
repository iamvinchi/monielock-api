import { Controller, Get, Param, Request } from '@nestjs/common';
import { UseAuthGuard } from 'src/utils/jwt/useAuth.guard';
import { TransactionsService } from './transactions.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Get('wallet')
    @UseAuthGuard()
    walletTransactions(@Request() req:any) {
        const id = req.user.sub
      return this.transactionsService.walletTransactions(id);
    } 

    @Get('trade')
    @UseAuthGuard()
    tradeTransactions(@Request() req:any) {
        const id = req.user.sub
      return this.transactionsService.tradeTransactions(id);
    }

    @Get('all')
    @UseAuthGuard()
    allTransactions(@Request() req:any) {
        const id = req.user.sub
      return this.transactionsService.allTransactions(id);
    }

    @Get('/:id')
    @UseAuthGuard()
    singleTransactions(@Param('id') id: string) {
      return this.transactionsService.singleTransactions(id);
    }
}
