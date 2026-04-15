import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import CustomError from './customError.utils';
import { verifyToken } from './jwt.utils';

@Injectable()
export class UtilsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token)
      throw new CustomError('Access denied: Unauthorised access', 401);

    if (token && !token.startsWith('Bearer'))
      throw new CustomError('Access denied: Malformed token', 401);

    const filteredToken = token.split(' ')[1];
    if (!filteredToken)
      throw new CustomError('Access denied: Uauthorised access', 401);

    let decoded;

    try {
      decoded = verifyToken(filteredToken);

      if (decoded === null)
        throw new CustomError('Access denied: Unauthorised access', 401);
    } catch (err) {
      next(err);
    }

    if (!decoded)
      return next(new CustomError('Access denied: Unauthorised access', 401));

    req['user'] = decoded;
    next();
  }
}
