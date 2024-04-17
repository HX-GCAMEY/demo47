import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersDbService } from '../users/users-db.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersDbService,
    private jwtService: JwtService,
  ) {}
  async signUp(user: Partial<User>) {
    const userFound = await this.usersService.findByEmail(user.email);

    if (userFound) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    if (!hashedPassword) {
      throw new BadRequestException('Password could not be hashed');
    }

    return await this.usersService.create({
      ...user,
      password: hashedPassword,
    });
  }

  async signIn(email: string, password: string) {
    const userFound = await this.usersService.findByEmail(email);

    if (!userFound) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const userPayload = {
      id: userFound.id,
      email: userFound.email,
      // isAmin: true
    };

    const token = this.jwtService.sign(userPayload);

    return {
      message: 'User logged in',
      token,
    };
  }
}
