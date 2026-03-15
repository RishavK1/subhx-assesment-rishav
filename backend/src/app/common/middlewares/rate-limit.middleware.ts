import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { connectRedis, redisClient } from '../clients/redis.client.js';

const createRedisRateLimiter = (limit: number) => {
  return rateLimit({
    windowMs: 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: async (...args: string[]) => {
        await connectRedis();
        return redisClient.sendCommand(args);
      }
    }),
    message: {
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.'
    }
  });
};

export const authWriteRateLimiter = createRedisRateLimiter(5);
export const authReadRateLimiter = createRedisRateLimiter(30);
