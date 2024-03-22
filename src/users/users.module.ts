import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity'; // Ensure the path to your entity is correct

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register the User entity
  providers: [UsersService],
  controllers: [UsersController],
  exports: [TypeOrmModule, UsersService], // Export UsersService if it's used outside this module
})
export class UsersModule {}
