import { Controller, Post, Response, Request } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}


    @Post('wallet')
    creditWallet(@Request() req: any, @Response() res: any) {
        const event = req.body;
        if(event.event.startsWith('transfer.')){
            return this.webhookService.withdrawal(req, res);
        }else if(event.event.startsWith('charge.')){
            return this.webhookService.creditWallet(req,res);
        }
      
    } 
}
