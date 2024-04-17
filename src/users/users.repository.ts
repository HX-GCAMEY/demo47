import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  private users = [
    {
      id: 1,
      name: 'Bartolomiau',
      email: 'barto@gmail.com',
    },
    {
      id: 2,
      name: 'Tota',
      email: 'tots@gmail.com',
    },
    {
      id: 3,
      name: 'Gama',
      email: 'gama@gmail.com',
    },
  ];

  getUsers() {
    return this.users;
  }

  getById(id: number) {
    console.log(typeof id);
    return this.users.find((user) => user.id === +id);
  }

  getByName(name: string) {
    return this.users.find((user) => user.name === name);
  }

  createUser(user: any) {
    const id = this.users.length + 1;
    this.users = [...this.users, { id, ...user }];

    return { id, ...user };
  }
}
