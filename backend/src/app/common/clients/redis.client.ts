import { createClient } from 'redis';
import { env } from '../config/env.js';

export const redisClient = createClient({
  url: env.REDIS_URL
});

let connectPromise: Promise<void> | null = null;

redisClient.on('error', (error) => {
  process.stderr.write(`${error instanceof Error ? error.message : 'Redis error'}\n`);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    connectPromise ??= redisClient
      .connect()
      .then(async () => {
        await redisClient.ping();
      })
      .finally(() => {
        connectPromise = null;
      });
    await connectPromise;
  }
};
