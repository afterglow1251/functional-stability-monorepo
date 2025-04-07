import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  users = [
    { id: 1, name: 'Yurii', age: 20 },
    { id: 2, name: 'Anna', age: 19 },
  ];

  findUsers() {
    return this.users;
  }
}
