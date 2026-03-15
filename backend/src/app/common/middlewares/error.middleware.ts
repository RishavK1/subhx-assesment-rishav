import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../helpers/app-error.js';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Route not found', 404, 'ROUTE_NOT_FOUND'));
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message
    });
    return;
  }

  const message = error instanceof Error ? error.message : 'Internal server error';

  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message
  });
};
