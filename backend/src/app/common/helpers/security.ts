import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { CookieOptions } from 'express';
import { v4 as uuid } from 'uuid';
import { env } from '../config/env.js';

export type TokenKind = 'access' | 'refresh';

export interface TokenPayload {
  sub: string;
  email: string;
  sid: string;
  jti: string;
  type: TokenKind;
}

const accessTokenTtlSeconds = env.ACCESS_TOKEN_TTL_MINUTES * 60;
const refreshTokenTtlSeconds = env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60;

export const issueAccessToken = (userId: string, email: string, sessionId: string) => {
  const payload: TokenPayload = {
    sub: userId,
    email,
    sid: sessionId,
    jti: uuid(),
    type: 'access'
  };

  const token = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: accessTokenTtlSeconds
  });

  return {
    token,
    payload,
    expiresInSeconds: accessTokenTtlSeconds
  };
};

export const issueRefreshToken = (userId: string, email: string, sessionId: string) => {
  const payload: TokenPayload = {
    sub: userId,
    email,
    sid: sessionId,
    jti: uuid(),
    type: 'refresh'
  };

  const token = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: refreshTokenTtlSeconds
  });

  return {
    token,
    payload,
    expiresInSeconds: refreshTokenTtlSeconds
  };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as TokenPayload;
};

export const hashToken = (value: string) => {
  return crypto.createHash('sha256').update(value).digest('hex');
};

export const generateOpaqueToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const getRefreshCookieOptions = (): CookieOptions => {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: env.NODE_ENV === 'production',
    maxAge: refreshTokenTtlSeconds * 1000,
    path: '/'
  };
};

export const getPublicCookieOptions = (maxAgeSeconds: number): CookieOptions => {
  return {
    httpOnly: false,
    sameSite: 'strict',
    secure: env.NODE_ENV === 'production',
    maxAge: maxAgeSeconds * 1000,
    path: '/'
  };
};

export const getBlacklistTtl = (issuedAtSeconds?: number, expiresAtSeconds?: number) => {
  if (!issuedAtSeconds || !expiresAtSeconds) {
    return accessTokenTtlSeconds;
  }

  const remaining = expiresAtSeconds - Math.floor(Date.now() / 1000);
  return remaining > 0 ? remaining : accessTokenTtlSeconds;
};
