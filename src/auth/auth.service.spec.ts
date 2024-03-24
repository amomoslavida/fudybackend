import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    // Mock UsersService and JwtService
    usersService = {
      findUserByEmail: jest.fn().mockImplementation((email) => {
        if (email === 'existing@example.com') {
          return Promise.resolve({
            email,
            password: bcrypt.hashSync('password', 10), // Simulate a hashed password
          });
        }
        return null;
      }),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mockToken'),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should validate and return a user if credentials are correct', async () => {
    expect(await authService.validateUser('existing@example.com', 'password')).toEqual({
      email: 'existing@example.com',
    });
  });

  it('should return null if user is not found', async () => {
    expect(await authService.validateUser('nonexisting@example.com', 'password')).toBeNull();
  });

  it('should throw UnauthorizedException if credentials are invalid', async () => {
    await expect(authService.login('existing@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
  });

  it('should return access token if login is successful', async () => {
    const result = await authService.login('existing@example.com', 'password');
    expect(result).toEqual({ access_token: 'mockToken' });
  });

  it('should throw an InternalServerErrorException if an unexpected error occurs during validation', async () => {
    jest.spyOn(usersService, 'findUserByEmail').mockRejectedValueOnce(new Error('Unexpected error'));
    await expect(authService.validateUser('existing@example.com', 'password')).rejects.toThrow(InternalServerErrorException);
  });
});
