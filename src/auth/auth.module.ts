import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy'; 
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [
   
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '5m' }, 
    }),
  ],
  providers: [AuthService, JwtStrategy], 
  controllers: [AuthController],
})
export class AuthModule {}
