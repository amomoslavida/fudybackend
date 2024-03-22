import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service'; // Adjust path as needed

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Ensures the token has not expired
      secretOrKey: process.env.JWT_SECRET, // Use the same secret as when signing the tokens
    });
  }

  async validate(payload: any) {
    // Optionally, add more validation logic here
    return await this.usersService.findUserByEmail(payload.email);
  }
}
