import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../helpers/app-error.js';

export const verifyCsrf = (req: Request, _res: Response, next: NextFunction) => {
  const headerToken = req.headers['x-csrf-token'];
  const cookieToken = req.cookies[env.CSRF_COOKIE_NAME];

  if (typeof headerToken !== 'string' || typeof cookieToken !== 'string' || headerToken !== cookieToken) {
    next(new AppError('CSRF token validation failed', 403, 'CSRF_VALIDATION_FAILED'));
    return;
  }

  next();
};
