import { Injectable, Inject } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject('API_USERS') private apiUsers: any[],
  ) {}

  async getUsers() {
    const DBusers = await this.usersRepository.getUsers();

    const users = [...DBusers, ...this.apiUsers];

    return users;
  }

  getUser(id: number) {
    return this.usersRepository.getById(id);
  }

  getByName(name: string) {
    return this.usersRepository.getByName(name);
  }

  createUser(user: any) {
    return this.usersRepository.createUser(user);
  }
}
