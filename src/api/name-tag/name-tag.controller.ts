import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('NameTag')
@Controller('name-tag')
export class NameTagController {}
