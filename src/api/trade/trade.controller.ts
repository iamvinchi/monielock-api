import { Body, Controller, Delete, Get, Param, Patch, Post, Request, Response } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseAuthGuard } from 'src/utils/jwt/useAuth.guard';
import { TradeService } from './trade.service';
import { CreateTradeDto, UpdateTradeDto, AddSubTradeDto } from './dto/trade.dto';

@ApiTags('Trade')
@Controller('trade')
export class TradeController {
    constructor(private readonly tradeService: TradeService) {}

    @Post()
    @UseAuthGuard()
    createTrade(@Request() req, @Body() createTradeDto: CreateTradeDto) {
        const id:string = req.user.sub
      return this.tradeService.createTrade(id, createTradeDto);
    }
  
    @Get()
    @UseAuthGuard()
    getAllTades(@Request() req) {
        const id:string = req.user.sub
        return this.tradeService.getAllTades(id);
    }

    @Get(':id')
    @UseAuthGuard()
    getTradeById(@Param('id') id: string) {
        return this.tradeService.getTradeById(id);
    }

    @Patch(':id')
    @UseAuthGuard()
    updateTrade(@Param('id') id: string, @Body() updateTradeDto: UpdateTradeDto) {
      return this.tradeService.updateTrade(id, updateTradeDto);
    }

    @Delete(':id')
    @UseAuthGuard()
    deleteTrade(@Param('id') id: string) {
      return this.tradeService.deleteTrade(id);
    }

    @Patch(':id/accept')
    @UseAuthGuard()
    acceptTrade(@Request() req, @Param('id') id: string) {
      const userId = req.user.sub
      return this.tradeService.acceptTrade(id, userId);
    }

    @Patch(':id/complete')
    @UseAuthGuard()
    completeTrade(@Param('id') id: string) {
      return this.tradeService.completeTrade(id);
    }

    // @Post(':id/sub')
    // @UseAuthGuard()
    // addSubTrade(@Request() req, @Body() addSubTrade: AddSubTradeDto) {
    //     const id:string = req.user.sub
    //   return this.tradeService.addSubTrade(id,addSubTrade);
    // }
    
}
