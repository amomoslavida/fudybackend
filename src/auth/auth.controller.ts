import { Controller, Post,Get,UseGuards,Request, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service'; // Ensure the path is correct
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Adjust path as needed

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('login')
  @HttpCode(HttpStatus.OK) // Optional: Sets the HTTP status code to 200 for successful requests
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return req.user; // `req.user` contains the user object returned by JwtStrategy's validate method
  }
}

