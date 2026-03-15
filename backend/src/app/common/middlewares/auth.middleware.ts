import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { redisClient } from '../clients/redis.client.js';
import { redisKeys } from '../constants/redis-keys.js';
import { AppError } from '../helpers/app-error.js';
import { verifyAccessToken } from '../helpers/security.js';

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError('Authorization header is required', 401, 'AUTHORIZATION_REQUIRED');
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Bearer token is required', 401, 'INVALID_AUTHORIZATION_HEADER');
    }

    const payload = verifyAccessToken(token);

    if (payload.type !== 'access') {
      throw new AppError('Invalid access token', 401, 'INVALID_ACCESS_TOKEN');
    }

    const isBlacklisted = await redisClient.exists(redisKeys.accessBlacklist(payload.jti));

    if (isBlacklisted) {
      throw new AppError('Access token has been revoked', 401, 'ACCESS_TOKEN_REVOKED');
    }

    req.auth = payload;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Access token has expired', 401, 'ACCESS_TOKEN_EXPIRED'));
      return;
    }

    next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
  }
};
