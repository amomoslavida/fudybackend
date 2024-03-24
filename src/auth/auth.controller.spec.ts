import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    // Mock AuthService
    authService = {
      login: jest.fn().mockImplementation((email: string, password: string) => {
        if (email === 'user@example.com' && password === 'password') {
          return { access_token: 'mockToken' }; // Simulate successful login
        }
        throw new UnauthorizedException('Invalid credentials');
      }),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    })
    .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true }) // Mock JwtAuthGuard
    .compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const result = await authController.login({ email: 'user@example.com', password: 'password' });
      expect(result).toEqual({ access_token: 'mockToken' });
      expect(authService.login).toHaveBeenCalledWith('user@example.com', 'password');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      await expect(authController.login({ email: 'user@example.com', password: 'wrong' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getMe', () => {
    it('should return the user object', () => {
      const req = { user: { email: 'user@example.com', id: 1 } }; // Simulate request object
      expect(authController.getMe(req)).toEqual(req.user);
    });
  });
});
