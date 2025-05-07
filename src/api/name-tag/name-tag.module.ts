import { Module } from '@nestjs/common';
import { NameTagService } from './name-tag.service';
import { NameTagController } from './name-tag.controller';

@Module({
  providers: [NameTagService],
  controllers: [NameTagController]
})
export class NameTagModule {}
