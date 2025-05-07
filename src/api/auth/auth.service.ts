import { Injectable } from '@nestjs/common';
import { randomAlphanumeric, randomDigits } from 'src/utils/common.util';
import { getTemplate } from 'src/utils/get-templates';
import { error, success } from 'src/utils/response.utils';
import { hash } from 'src/utils/security.utils';
import { manageExpiresDate } from 'src/utils/time.util';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './schemas/auth.schema';
import { Model, Types } from 'mongoose';
import { ChangePasswordDto, CreateAuthDto, ForgotPasswordDto, LoginDto, RefreshTokenDto, ResendCodeDto, ResetPasswordDto, ValidateEmailDto } from './dto/auth.dto';
import { Wallet, WalletDocument } from '../user/shemas/wallet.schema';
import * as moment from 'moment';
import { Authutil } from 'src/utils/auth.utils';
import { EmailService } from 'src/utils/helper.services/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    private readonly authutil:Authutil,
    private readonly emailService: EmailService,
    // private readonly validationService: EmailValidationService
  ) {}
  
  async create(createAuthDto: CreateAuthDto) {
    try {
      const {email, phone, password, confirm} = createAuthDto

      const auth = await this.authModel.findOne({email})
      if(auth){
        return error(
          'Register',
          `An account with provided email already exist.`,
        );
      }
  
      if(password !== confirm){
        return error(
          'Register',
          `Password do not match!`,
        );
      }
  
        const hashedPassword = hash(password)

        const verificationCode = randomDigits(6)

        const codeExpires = await manageExpiresDate()

        const newUser = await this.authModel.create({
            email, 
            phone,
            password: hashedPassword,
            verificationCode,
            codeExpires
          })

        await this.walletModel.create({
            balance: "0",
            owner:newUser._id
          })

          const msg = await getTemplate(
            'welcome',
            {
              to:email,
              subject:"Email Verification",
              name: `${email.split('@')[0]}`,
              verificationCode,
              codeExpires: process.env.CODE_EXPIRY_MINUTE
            },
            {
              escape:(html:any) => {
                return String(html)
              }
            }
          )
      
          await this.emailService.sendMail(
            [email],
            'Email Verifications',
            msg
          );
         
          delete newUser.password
  
          return success(
            {
              user: newUser,
            },
            'Register',
            'Sign up successful.',
          );
       
    } catch (err) {
      return error(
        'Register',
        `${err}`,
      );
    }
   
  }

  async validateEmail(emailValidation:ValidateEmailDto){
    const {code} = emailValidation
    const auth = await this.authModel.findOne({verificationCode: code})

    if(moment(auth?.codeExpires).format('YYYY-MM-DDTHH:mm:ss') < moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')){
      return error(
        'Register',
        `Code expired.`,
      )
    }

    if(!auth){
      return error(
        'Register',
        `Email validation failed. Ensure you have provided the correct code.`,
      );
    }else{
      await this.authModel.findByIdAndUpdate(auth._id,{
        isVerified: true,
        verificationCode:null,
        codeExpires: null
      })
      return success(
        {},
        'Email Validation',
        'Email validation successful.',
      );
    }
  }

  async resendCode(resendCodeDto: ResendCodeDto) {
    try {
      const {email} = resendCodeDto

      const auth = await this.authModel.findOne({email})
      if(!auth){
        return error(
          'Resend code',
          `Account with provided email not found.`,
        );
      }
  
        const verificationCode = randomDigits(6)
        const codeExpires:any = await manageExpiresDate()
        
          const msg = await getTemplate(
            'resendCode',
            {
              to:email,
              subject:"Resend verification code",
              name: `${email.split('@')[0]}`,
              verificationCode,
              codeExpires: process.env.CODE_EXPIRY_MINUTE, 
            },
            {
              escape:(html:any) => {
                return String(html)
              }
            }
          )
      
          await this.emailService.sendMail(
            [email],
            'Resend verification code',
            msg
          );
         
         auth.verificationCode = verificationCode
         auth.codeExpires = codeExpires
         auth.save()
  
          return success(
            {},
            'Resend code',
            'Verification code sent successfully.',
          );
       
    } catch (err) {
      return error(
        'Resend code',
        `${err}`,
      );
    }
   
  }

  async login(loginDto: LoginDto){
    try {
    const {email, password} = loginDto

    const userAuth = await this.authModel.findOne({email})
    
    const isValidPassword = await this.authutil.validateUser(userAuth, password)

    if(!userAuth || !isValidPassword){
      return error(
        'Login',
        `Invalid email or password`,
      );
    }

    if(!userAuth.isVerified){
      return error(
        'Login',
        'Account not activated. Please activate your account',
      );
    }
      
    const token  = await this.authutil.getToken(userAuth)
    const refresh_token = await this.authutil.createRefreshToken(userAuth)

      return success( 
        {
          auth:{
            id: userAuth._id,
            email: userAuth.email,
          },
          token,
          refresh_token
        },
        'Login',
        'User successfully logged in',
      );
    } catch (err) {
      return error(
        'Login',
        `${err}`,
      );
    }
  }

  async refreshToken(tokenDto: RefreshTokenDto){
    const {token} = tokenDto
    try {
      const refresh_token  = await this.authutil.regenerateAccessToken(token)

      return success(
        {
          refresh_token
        },
        'Refresh Token',
        'Refresh token successfully created',
      );
    } catch (err) {
      return error(
        'Refresh Token',
        `${err}`,
      );
    }
  }

  async changePassword(id, changePasswordDto:ChangePasswordDto) {
    const {currentPassword, newPassword, confirm} = changePasswordDto
    const userAuth = await this.authModel.findById({_id:id})
    if(!userAuth){
      return error(
        'Change Password',
        `Account not found`,
      )
    }

    const isValidPassword = await this.authutil.validateUser(userAuth, currentPassword)

    if(!isValidPassword){
      return error(
        'Change Password',
        `Current password incorrect`,
      );
    }

    if(newPassword !== confirm){
      return error(
        'Change Password',
        `Password do not match!`,
      );
    }

    const hashedPassword = hash(newPassword)
    await this.authModel.findByIdAndUpdate(id, {password:hashedPassword})
    return success(
      {},
      'Change Password',
      'Password successfully changed',
    );
  }

  async forgotPassword(forgotPasswordDto:ForgotPasswordDto) {
    const {email} = forgotPasswordDto

    const userAuth = await this.authModel.findOne({email})
    if(!userAuth){
      return error(
        'Forgot Password',
        `Account with provided email not found`,
      );
    }

    const resetToken = randomDigits(6)

    const expiresIn = await manageExpiresDate()

    await this.authModel.findByIdAndUpdate({_id: new Types.ObjectId(userAuth.id)}, {
      resetPasswordToken:resetToken,
      resetPasswordTokenExpires:expiresIn,
    })

    const msg = await getTemplate(
      'forgotPassword',
      {
        to:email,
        subject:"Password Reset Request",
        resetToken,
        codeExpires: process.env.CODE_EXPIRY_MINUTE,
      },
      {
        escape:(html:any) => {
          return String(html)
        }
      }
    )

    await this.emailService.sendMail(
      [email],
      'Password Reset Request',
      msg
    );

    return success(
      'Forgot Password',
      `Reset password code sent to your email.`,
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const {token, password, confirm} = resetPasswordDto

    const authUser = await this.authModel.findOne({resetPasswordToken: token})

    if(!authUser){
      return error(
        'Reset Password',
      `Invalid validation token.`,
      )
    }

    if(authUser.resetPasswordTokenExpires < new Date()){
      return error(
        'Reset Password',
      `Token expired.`,
      )
    }

    if(password !== confirm){
      return error(
        'Reset Password',
        `Password do not match!`,
      );
    }

    const hashedPassword = hash(password)
    
    await this.authModel.findByIdAndUpdate(authUser._id, {
      password:hashedPassword,
      resetPasswordToken:null,
      resetPasswordTokenExpires:null,
    })


    const msg = await getTemplate(
      'confirmPasswordReset',
      {
        subject:"Password Updated Successfully",
      },
      {
        escape:(html:any) => {
          return String(html)
        }
      }
    )

    await this.emailService.sendMail(
      [authUser.email],
      'Password Updated Successfully',
      msg
    );

    return success(
      {},
      'Reset Password',
      'Password reset successfully',
    );
  }

}
