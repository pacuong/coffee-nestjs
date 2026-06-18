import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }
}
