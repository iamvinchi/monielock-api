import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from './security.utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Authutil {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
      ) {}

      async getToken(user: any) {
        try {
          const payload = { email: user.email, sub: user._id};
        return this.jwtService.sign(payload);
        } catch (error) {
          console.log(error)
        }
      }

      async createRefreshToken(user: any) {
        const payload = { sub: user._id, email: user.email };
        return this.jwtService.sign(payload, {expiresIn: '30d'})
      }

      async regenerateAccessToken(token: string) {
        const user = await this.jwtService.verify(token)
        const payload = { sub: user.sub, email: user.email };
        return this.jwtService.sign(payload)
      }
    
      async validateUser(userAuth: any, secret: string): Promise<any> {
        
        if (userAuth && compare(secret, userAuth.password)) {
          const { password, ...result } = userAuth;
          return result;
        }
        return null;
      }
}