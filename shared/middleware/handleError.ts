import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors.js';
import { logger } from '../logger.js';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestLogger = (req as Request & { log?: typeof logger }).log ?? logger;

  if (err instanceof CustomError) {
    requestLogger.warn(
      {
        method: req.method,
        url: req.originalUrl,
        statusCode: err.statusCode,
        message: err.message,
      },
      'Request failed with custom error',
    );

    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Любая другая ошибка
  requestLogger.error(
    {
      err,
      method: req.method,
      url: req.originalUrl,
      statusCode: 500,
    },
    'Unhandled application error',
  );

  return res.status(500).json({
    message: 'Internal server error',
  });
};
