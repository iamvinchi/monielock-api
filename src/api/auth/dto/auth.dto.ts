import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, Matches, MinLength } from "class-validator";

  const passwordRegEx =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  export class CreateAuthDto {
  
    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @ApiProperty()
    readonly email: string;

    @IsNotEmpty({ message: 'Phone can not be empty' })
    @IsPhoneNumber()
    @ApiProperty()
    phone: string;
  
    @IsNotEmpty()
    @ApiProperty()
    @Matches(passwordRegEx, {
      message: `Password must contain Minimum 8 and maximum 20 characters,at least one uppercase letter,one lowercase letter,one number and one special character`,
    })
    password: string;

    @IsNotEmpty()
    @ApiProperty()
    @Matches(passwordRegEx, {
      message: `Confirm password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character`,
    })
    confirm:string

  }

  export class ValidateEmailDto {
    @IsNotEmpty()
    @ApiProperty()
    code: string;
}

  export class LoginDto {
    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @ApiProperty()
    readonly email: string;
    
    @IsNotEmpty()
    @ApiProperty()
    @Matches(passwordRegEx, {
      message: `Password must contain Minimum 8 and maximum 20 characters,at least one uppercase letter,one lowercase letter,one number and one special character`,
    })
    password: string;
  }

  export class RefreshTokenDto{
    @IsNotEmpty()
    @ApiProperty()
    token: string;
  }

  export class ChangePasswordDto{
    @IsNotEmpty()
    @ApiProperty()
    @Matches(passwordRegEx, {
      message: `Current password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character`,

    })
    currentPassword: string;

    @IsNotEmpty()
    @ApiProperty()
    @Matches(passwordRegEx, {
      message: `New password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character`,
    })
    newPassword: string;

    @IsNotEmpty()
    @ApiProperty()
    @Matches(passwordRegEx, {
      message: `Confirm Password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character`,

    })
    confirm: string;
  }

  export class ForgotPasswordDto{
    @IsNotEmpty()
    @ApiProperty()
    @IsEmail()
    email: string;
  }

  export class ResetPasswordDto{
    @IsString()
    @MinLength(6, { message: 'Token must have atleast 6 characters.' })
    @IsNotEmpty()
    @ApiProperty()
    token: string;

    @IsNotEmpty()
    @ApiProperty()
    @Matches(passwordRegEx, {
      message: `Password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character`,

    })
    password: string;

    @IsNotEmpty()
    @ApiProperty()
    @Matches(passwordRegEx, {
      message: `Confirm Password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character`,

    })
    confirm: string;
  }

  export class ResendCodeDto{
    @IsNotEmpty()
    @ApiProperty()
    email: string;
  }