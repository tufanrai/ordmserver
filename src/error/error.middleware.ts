import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/customError.utils';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}

export function GlobalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Access denied: Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Access denied: Token has expired',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Internal server error',
  });
}
