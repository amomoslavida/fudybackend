import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUserDto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    // Mock UsersService
    usersService = {
      createUser: jest.fn().mockImplementation((email: string, password: string) => ({
        id: Date.now(), // Simulate generating an ID
        email,
        password, 
      })),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('create', () => {
    it('should create a new user and return the user data', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password123' };
      const result = await usersController.create(createUserDto);

      expect(result).toEqual({
        id: expect.any(Number),
        email: 'test@example.com',
        password: 'password123', 
      });
      expect(usersService.createUser).toHaveBeenCalledWith(createUserDto.email, createUserDto.password);
    });
  });
});
