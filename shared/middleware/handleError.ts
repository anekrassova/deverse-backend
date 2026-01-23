import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors.js';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Любая другая ошибка
  console.error(err);

  return res.status(500).json({
    message: 'Internal server error',
  });
};
