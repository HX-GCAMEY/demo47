import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersDbService } from './users-db.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { sign } from 'crypto';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: Partial<UsersDbService>;

  beforeEach(async () => {
    mockUsersService = {
      findByEmail: () => Promise.resolve(undefined),

      create: (user: Partial<User>): Promise<User> =>
        Promise.resolve({
          ...user,
          isAdmin: false,
          id: '1234fs-234sd-24csdf-34sdfg',
        } as User),
    };

    const mockJwtService = {
      sign: (payload) => jwt.sign(payload, 'testsecret'),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersDbService, useValue: mockUsersService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  const mockUser: Omit<User, 'id'> = {
    name: 'Bartolomiau',
    createdAt: '26/02/2024',
    password: 'password123',
    email: 'barto@gmail.com',
  };

  it('Testing AuthService is defined', () => {
    expect(authService).toBeDefined();
  });

  it('signUp() creates a new user with a hashed password', async () => {
    const user = await authService.signUp(mockUser as User);

    expect(user).toBeDefined();
    expect(user.password).not.toEqual(mockUser.password);
  });

  it('signUp() thows an error if the email already exists', async () => {
    mockUsersService.findByEmail = () => Promise.resolve(mockUser as User);

    try {
      await authService.signUp(mockUser as User);
    } catch (error) {
      expect(error.message).toEqual('User already exists');
    }
  });

  it('signIn() return an object with a message and a token iof the user logs in correctly', async () => {
    const mockUserVariant = { ...mockUser };

    mockUserVariant.password = await bcrypt.hash(
      mockUser.password as string,
      10,
    );
    mockUsersService.findByEmail = () =>
      Promise.resolve(mockUserVariant as User);

    const response = await authService.signIn(
      mockUser.email as string,
      mockUser.password as string,
    );

    expect(response).toBeDefined();
  });
});
