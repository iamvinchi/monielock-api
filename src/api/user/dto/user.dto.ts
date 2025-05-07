import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateKycDto {
  
    @IsNotEmpty({ message: 'Full name cannot be empty' })
    @ApiProperty()
    fullName: string;

    @IsNotEmpty({ message: 'Address can not be empty' })
    @ApiProperty()
    address: string;
  
    @IsNotEmpty({ message: 'Bank name can not be empty' })
    @ApiProperty()
    bankCode: string;

    @IsNotEmpty({ message: 'Account name can not be empty' })
    @ApiProperty()
    accountName: string;

    @IsNotEmpty({ message: 'Account number can not be empty' })
    @ApiProperty()
    accountNumber: string;

    @IsNotEmpty({ message: 'Pin can not be empty' })
    @ApiProperty()
    pin:string

}

export class AddBankDto {
  
    @IsNotEmpty({ message: 'Bank Code can not be empty' })
    @ApiProperty()
    bankCode: string;

    @IsNotEmpty({ message: 'Account name can not be empty' })
    @ApiProperty()
    accountName: string;

    @IsNotEmpty({ message: 'Account number can not be empty' })
    @ApiProperty()
    accountNumber: string;

  }

  export class UpdateBankDto {
  
    @ApiPropertyOptional()
    bankName: string;

    @ApiPropertyOptional()
    accountName: string;

    @ApiPropertyOptional()
    accountNumber: string;

  }

  export class ResetPinDto {
    @IsNotEmpty({ message: 'New pin can not be empty' })
    @ApiProperty()
    newPin: string;
  }

  export class FundWalletDto {
    @IsNotEmpty({ message: 'Amount can not be empty' })
    @ApiProperty()
    amount: string;
  }

  export class WalletWithdrawDto {
    @IsNotEmpty({ message: 'Amount can not be empty' })
    @ApiProperty()
    amount: string;

    @IsNotEmpty({ message: 'Bank Code can not be empty' })
    @ApiProperty()
    bankCode: string;

    @IsNotEmpty({ message: 'Account name can not be empty' })
    @ApiProperty()
    accountName: string;

    @IsNotEmpty({ message: 'Account number can not be empty' })
    @ApiProperty()
    accountNumber: string;

    @ApiPropertyOptional()
    reason: string;
  }