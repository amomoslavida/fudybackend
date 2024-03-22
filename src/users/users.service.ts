import { Injectable } from '@nestjs/common';
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
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt round
        const newUser = this.usersRepository.create({ email, password: hashedPassword });
        
        await this.usersRepository.save(newUser);
        return newUser;
      }
     
      async findUserByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { email } });
      }
      
}
