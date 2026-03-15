import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().min(1),
  CORS_ORIGIN: z.string().min(1),
  ACCESS_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().int().min(15).max(30),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().min(7).max(30),
  REFRESH_COOKIE_NAME: z.string().min(1).default('refresh_token'),
  CSRF_COOKIE_NAME: z.string().min(1).default('csrf_token'),
  AUTH_HINT_COOKIE_NAME: z.string().min(1).default('auth_hint'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(14),
  IP_WHITELIST: z.string().min(1)
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Invalid environment configuration: ${parsedEnv.error.message}`);
}

export const env = parsedEnv.data;
