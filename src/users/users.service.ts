import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findUser(id: string): Promise<User|null> {
    console.log(`findUser: ${id}`);
    try {
        return this.usersRepository.findOne({id: id})
    } catch (e) {
        console.log(e);
        return null;
    }
}
  async findUserByName(name: string): Promise<User|null> {
      console.log(`findUserByName: ${name}`);
      try {
          return this.usersRepository.findOne({select: ['id', 'name', 'password'], where: {name}})
      } catch (e) {
          console.log(e);
          return null;
      }
  }

  async addUser(name: string, password: string): Promise<null|User> {
      console.log(`addUser: ${name} ${password}`);
      let user: User = new User();
      user.name = name;
      user.password = password;
      user.id = randomUUID();

      try {
          this.usersRepository.insert(user);
          return user;
      } catch (e) {
          console.log(e);
      }
      return null;
  }
}
 