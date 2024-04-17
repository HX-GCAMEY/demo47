import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LoggerMiddleware } from '../middlewares/logger';
import { UsersRepository } from './users.repository';
import { UsersDbService } from './users-db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CloudinaryConfig } from '../config/cloudinary';
import { CloudinaryService } from './cloudinary.service';
import { AuthService } from './auth.service';
import { requiresAuth } from 'express-openid-connect';

// const mockUsersService = {
//   getUsers() {
//     return 'Esta es la funcion mock';
//   },
// };

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    // {
    //   provide: UsersService,
    //   useValue: mockUsersService,
    // },
    UsersService,
    CloudinaryConfig,
    CloudinaryService,
    UsersRepository,
    AuthService,
    {
      provide: 'API_USERS',
      useFactory: async () => {
        const apiUsers = await fetch(
          'https://jsonplaceholder.typicode.com/users',
        ).then((response) => response.json());
        const cleanUsers = apiUsers.map((user) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        });
        return cleanUsers;
      },
    },
    UsersDbService,
  ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users');
    consumer.apply(requiresAuth()).forRoutes('users/auth0/protected');
  }
}
