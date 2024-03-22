  import { Controller, Post, Body } from '@nestjs/common';
  import { UsersService } from './users.service'; // Ensure the path is correct
  import { CreateUserDto } from './dto/CreateUserDto'; // Define this DTO for validation

  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.createUser(createUserDto.email, createUserDto.password);
    }
  }
