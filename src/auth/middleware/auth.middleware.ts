// auth/middleware/auth.middleware.ts
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/jwt.utils';
import CustomError from '../../utils/customError.utils';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return next(new CustomError('Access denied: No token provided', 401));

    const token = authHeader.split(' ')[1];

    if (!token)
      return next(new CustomError('Access denied: Malformed token', 401));

    try {
      const decoded = verifyToken(token);
      if (decoded && decoded.exp && decoded.exp < Math.floor(Date.now() / 1000))
        return next(
          new CustomError('Access denied: Token expired, please login', 401),
        );

      req['user'] = decoded ?? undefined;
      next();
    } catch (err) {
      return next(
        new CustomError('Access denied: Invalid or expired token', 401),
      );
    }
  }
}
