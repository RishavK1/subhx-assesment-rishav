import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../helpers/app-error.js';
import { resolveRequestIp } from '../helpers/request.js';

const whitelist = new Set(
  env.IP_WHITELIST.split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
);

export const ipWhitelist = (req: Request, _res: Response, next: NextFunction) => {
  const ip = resolveRequestIp(req);

  if (!whitelist.has(ip)) {
    next(new AppError(`IP address ${ip} is not allowed`, 403, 'IP_NOT_ALLOWED'));
    return;
  }

  next();
};
