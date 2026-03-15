import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { UserModel } from './auth.model.js';
import type { AuthUser, LoginRequest, RegisterRequest } from './auth.schema.js';
import { redisClient } from '../../common/clients/redis.client.js';
import { env } from '../../common/config/env.js';
import { redisKeys } from '../../common/constants/redis-keys.js';
import { AppError } from '../../common/helpers/app-error.js';
import {
  generateOpaqueToken,
  getBlacklistTtl,
  hashToken,
  issueAccessToken,
  issueRefreshToken,
  verifyRefreshToken
} from '../../common/helpers/security.js';

type SessionState = Record<'userId' | 'email' | 'refreshTokenHash' | 'csrfToken', string>;

interface AuthSession {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
  user: AuthUser;
}

const serializeUser = (user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}): AuthUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
};

const storeRefreshSession = async (
  sessionId: string,
  state: SessionState,
  expiresInSeconds: number
) => {
  await redisClient.multi().hSet(redisKeys.refreshSession(sessionId), state).expire(redisKeys.refreshSession(sessionId), expiresInSeconds).exec();
};

const buildSession = async (user: {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}, sessionId?: string): Promise<AuthSession> => {
  const effectiveSessionId = sessionId ?? crypto.randomUUID();
  const access = issueAccessToken(user.id, user.email, effectiveSessionId);
  const refresh = issueRefreshToken(user.id, user.email, effectiveSessionId);
  const csrfToken = generateOpaqueToken();

  await storeRefreshSession(
    effectiveSessionId,
    {
      userId: user.id,
      email: user.email,
      refreshTokenHash: hashToken(refresh.token),
      csrfToken
    },
    refresh.expiresInSeconds
  );

  return {
    accessToken: access.token,
    refreshToken: refresh.token,
    csrfToken,
    user: serializeUser(user)
  };
};

export class AuthService {
  public async register(input: RegisterRequest): Promise<AuthUser> {
    const existingUser = await UserModel.exists({
      email: input.email.toLowerCase()
    });

    if (existingUser) {
      throw new AppError('Email is already registered', 409, 'EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);
    try {
      const user = await UserModel.create({
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash
      });

      return serializeUser({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } catch (error) {
      const code = typeof error === 'object' && error && 'code' in error ? error.code : undefined;

      if (code === 11000) {
        throw new AppError('Email is already registered', 409, 'EMAIL_ALREADY_EXISTS');
      }

      throw error;
    }
  }

  public async login(input: LoginRequest): Promise<AuthSession> {
    const user = await UserModel.findOne({
      email: input.email.toLowerCase()
    }).exec();

    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    return buildSession({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  }

  public async getAuthenticatedUser(userId: string): Promise<AuthUser> {
    const user = await UserModel.findById(userId).exec();

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    return serializeUser({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  }

  public async refreshSession(refreshToken: string): Promise<AuthSession> {
    let payload: ReturnType<typeof verifyRefreshToken>;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Refresh token has expired', 401, 'REFRESH_TOKEN_EXPIRED');
      }

      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    if (payload.type !== 'refresh') {
      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    const session = await redisClient.hGetAll(redisKeys.refreshSession(payload.sid));

    if (!session.userId) {
      throw new AppError('Refresh session not found', 401, 'REFRESH_SESSION_NOT_FOUND');
    }

    if (session.refreshTokenHash !== hashToken(refreshToken)) {
      await redisClient.del(redisKeys.refreshSession(payload.sid));
      throw new AppError('Refresh token has been rotated', 401, 'REFRESH_TOKEN_ROTATED');
    }

    const user = await UserModel.findById(session.userId).exec();

    if (!user) {
      await redisClient.del(redisKeys.refreshSession(payload.sid));
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    return buildSession(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      payload.sid
    );
  }

  public async logout(accessToken: string | undefined, refreshToken: string | undefined): Promise<void> {
    if (refreshToken) {
      try {
        const refreshPayload = verifyRefreshToken(refreshToken);
        await redisClient.del(redisKeys.refreshSession(refreshPayload.sid));
      } catch (error) {
        void error;
      }
    }

    if (!accessToken) {
      return;
    }

    const tokenValue = accessToken.replace(/^Bearer\s+/i, '');

    try {
      const decoded = verifyAccessTokenWithDates(tokenValue);

      if (decoded.jti) {
        const ttl = getBlacklistTtl(decoded.iat, decoded.exp);
        await redisClient.set(redisKeys.accessBlacklist(decoded.jti), '1', {
          EX: ttl
        });
      }
    } catch (error) {
      void error;
    }
  }
}

const verifyAccessTokenWithDates = (token: string) => {
  const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload & {
    jti: string;
    type: 'access' | 'refresh';
  };

  if (decoded.type !== 'access') {
    throw new AppError('Invalid access token', 401, 'INVALID_ACCESS_TOKEN');
  }

  if (!decoded.jti || !decoded.type) {
    throw new AppError('Invalid token payload', 401, 'INVALID_TOKEN_PAYLOAD');
  }

  return decoded;
};
