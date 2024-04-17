import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

// function validateRequest(request) {
//   const token = request.headers['token'];

//   return token === '1234';
// }

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    //authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwY2JkY2U3ZC03ZjJiLTRkNWYtYjk0NC05N2ExNzExMWJjNGQiLCJpZCI6IjBjYmRjZTdkLTdmMmItNGQ1Zi1iOTQ0LTk3YTE3MTExYmM0ZCIsImVtYWlsIjoiZmFicml6aW9AZ21haWwuY29tIiwiaWF0IjoxNzExMzcyODU2LCJleHAiOjE3MTEzNzY0NTZ9.eHI1B90-zaLKbtNeTVJ6VVwSA3zP0gAM1Lajv_7ioh8"

    const token = request.headers['authorization']?.split(' ')[1] ?? '';

    try {
      const secret = process.env.JWT_SECRET;

      const payload = this.jwtService.verify(token, { secret });
      payload.iat = new Date(payload.iat * 1000);
      payload.exp = new Date(payload.exp * 1000);
      // payload.isAdmin
      payload.roles = ['user'];
      request.user = payload;

      return true;
    } catch (error) {}
    throw new BadRequestException('Invalid Token');
    // return validateRequest(request);
  }
}
