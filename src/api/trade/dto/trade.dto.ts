import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

  export class CreateTradeDto {
  
    @IsNotEmpty({ message: 'Trader cannot be empty' })
    @IsEnum(['buyer, seller'])
    @ApiProperty()
    initiator: string;

    @IsNotEmpty({ message: 'Category can not be empty' })
    @IsEnum(['item', 'service'])
    @ApiProperty()
    category: string;

    @IsNotEmpty({ message: 'Product name can not be empty' })
    @IsString()
    @ApiProperty()
    productName: string;

    @IsNotEmpty({ message: 'Amount can not be empty' })
    @IsNumber()
    @ApiProperty()
    amount: string;

    @ApiPropertyOptional()
    description: string;
  
    @IsNotEmpty({ message: 'Amount can not be empty' })
    @IsString()
    @ApiProperty()
    tag: string;

    @ApiPropertyOptional()
    image:string

    @ApiPropertyOptional()
    quantity:string

  }

  export class AddSubTradeDto {

    @IsNotEmpty({ message: 'Trade Id can not be empty' })
    @IsString()
    @ApiProperty()
    tradeId: string;
  
    @IsNotEmpty({ message: 'Trader cannot be empty' })
    @IsEnum(['buyer, seller'])
    @ApiProperty()
    initiator: string;

    @IsNotEmpty({ message: 'Category can not be empty' })
    @IsEnum(['item', 'service'])
    @ApiProperty()
    category: string;

    @IsNotEmpty({ message: 'Product name can not be empty' })
    @IsString()
    @ApiProperty()
    productName: string;

    @IsNotEmpty({ message: 'Amount can not be empty' })
    @IsNumber()
    @ApiProperty()
    amount: string;

    @ApiPropertyOptional()
    description: string;
  
    @IsNotEmpty({ message: 'Amount can not be empty' })
    @IsString()
    @ApiProperty()
    tag: string;

    @ApiPropertyOptional()
    image:string

    @ApiPropertyOptional()
    quantity:string

  }

  export class UpdateTradeDto{
    
  }