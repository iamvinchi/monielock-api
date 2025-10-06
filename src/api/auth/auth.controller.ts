import { Body, Controller, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  CreateAuthDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  ResendCodeDto,
  ResetPasswordDto,
  ValidateEmailDto,
} from './dto/auth.dto';
import { UseAuthGuard } from 'src/utils/jwt/useAuth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('verify')
  validateEmail(@Body() emailValidation: ValidateEmailDto) {
    return this.authService.validateEmail(emailValidation);
  }

  @Post('resend-code')
  resendCode(@Body() resendCodeDto: ResendCodeDto) {
    return this.authService.resendCode(resendCodeDto);
  }

  @Post('refresh-token')
  refreshToken(@Body() token: RefreshTokenDto) {
    return this.authService.refreshToken(token);
  }

  @Post('change-password')
  @UseAuthGuard()
  changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const id = req.user.sub;
    return this.authService.changePassword(id, changePasswordDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
