import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt round
      const newUser = this.usersRepository.create({ email, password: hashedPassword });

      await this.usersRepository.save(newUser);
      return newUser;
    } catch (error) {
      if (error.code === '23505') { // Unique violation error code for PostgreSQL
        throw new ConflictException('A user with this email already exists');
      } else {
        throw new InternalServerErrorException('Failed to create user');
      }
    }
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find user');
    }
  }
}
