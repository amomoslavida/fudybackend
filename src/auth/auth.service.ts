import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // Update the path according to your project structure
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
      ) {}

      async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findUserByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
          const { password, ...result } = user;
          return result; // Return the user object without the password field
        }
        return null;
      }

      async login(email: string, password: string): Promise<{ access_token: string }> {
        const user = await this.usersService.findUserByEmail(email);
    
        if (user && await bcrypt.compare(password, user.password)) {
          const payload = { email: user.email, sub: user.id };
          return {
            access_token: this.jwtService.sign(payload),
          };
        } else {
          throw new UnauthorizedException('Invalid credentials');
        }
      }
      
      
}
