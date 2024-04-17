import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Estas ejecutando un método GET en la ruta ${req.baseUrl}`);

    next();
  }
}

export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
  console.log(
    `Estas ejecutando un middleware global y estas actualmente ${req.url}`,
  );
  next();
}
