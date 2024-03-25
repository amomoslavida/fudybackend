  import { Controller, Post, Body } from '@nestjs/common';
  import { UsersService } from './users.service'; 
  import { CreateUserDto } from './dto/CreateUserDto'; 
  import { ApiResponse, ApiTags } from '@nestjs/swagger';

  @ApiTags('user')
  @Controller('user')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiResponse({ status: 200, description: 'create User.' })
    async create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.createUser(createUserDto.email, createUserDto.password);
    }
  }
