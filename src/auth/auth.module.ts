import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy'; // Ensure you have implemented JwtStrategy
import { UsersModule } from '../users/users.module'; // Import the UsersModule if it's used by JwtStrategy

@Module({
  imports: [
    // Import UsersModule if your JwtStrategy requires it to validate users
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use an environment variable for your secret
      signOptions: { expiresIn: '5m' }, // Set token expiration to 5 minutes
    }),
  ],
  providers: [AuthService, JwtStrategy], // Include JwtStrategy in your providers
  controllers: [AuthController],
})
export class AuthModule {}
