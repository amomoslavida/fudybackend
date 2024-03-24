import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // Ensure the path is correct based on your project structure
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findUserByEmail(email);
      if (user && await bcrypt.compare(pass, user.password)) {
        const { password, ...result } = user;
        return result; // Return the user object without the password field
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException('Failed to validate user');
    }
  }

  async login(email: string, password: string): Promise<{ access_token: string }> {
    try {
      const user = await this.validateUser(email, password);

      if (user) {
        const payload = { email: user.email, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      // If the error is already an instance of UnauthorizedException, rethrow it
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // For any other type of error, throw an InternalServerErrorException
      throw new InternalServerErrorException('Login failed due to an unexpected error');
    }
  }
}
