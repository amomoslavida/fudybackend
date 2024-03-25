import { Controller, Post,Get,UseGuards,Request, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service'; 
import { JwtAuthGuard } from './guards/jwt-auth.guard'; 
import { ApiResponse, ApiTags } from '@nestjs/swagger';

 
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('login')
  @ApiResponse({ status: 200, description: 'Login.' })
  @HttpCode(HttpStatus.OK) 
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiResponse({ status: 200, description: 'get current user.' })
  getMe(@Request() req) {
    return req.user; // `req.user` contains the user object returned by JwtStrategy's validate method
  }
}

