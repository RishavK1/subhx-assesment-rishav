import { Router } from 'express';
import { authRouter } from '../features/auth/auth.routes.js';

const appRouter = Router();

appRouter.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok'
  });
});

appRouter.use('/auth', authRouter);

export { appRouter };
