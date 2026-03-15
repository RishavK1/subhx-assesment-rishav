import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectMongo } from './common/clients/mongo.client.js';
import { connectRedis, redisClient } from './common/clients/redis.client.js';
import { env } from './common/config/env.js';
import { errorHandler, notFoundHandler } from './common/middlewares/error.middleware.js';
import { ipWhitelist } from './common/middlewares/ip-whitelist.middleware.js';
import { appRouter } from './router/index.js';

const bootstrap = async () => {
  await connectMongo();
  await connectRedis();

  const app = express();

  app.set('trust proxy', 1);

  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
      credentials: true
    })
  );
  app.use(helmet());
  app.use(morgan('combined'));
  app.use(express.json());
  app.use(cookieParser());
  app.use(ipWhitelist);
  app.use('/api', appRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  const server = app.listen(env.PORT, () => {
    process.stdout.write(`Backend listening on port ${env.PORT}\n`);
  });

  const shutdown = async () => {
    server.close();
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void shutdown();
  });

  process.on('SIGTERM', () => {
    void shutdown();
  });
};

void bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Backend bootstrap failed';
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
