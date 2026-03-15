import { Router } from 'express';
import { authenticate } from '../../common/middlewares/auth.middleware.js';
import { verifyCsrf } from '../../common/middlewares/csrf.middleware.js';
import {
  authReadRateLimiter,
  authWriteRateLimiter
} from '../../common/middlewares/rate-limit.middleware.js';
import { login, logout, me, refresh, register } from './auth.controller.js';
import { validateLogin, validateRegister } from './auth.validators.js';

const authRouter = Router();

authRouter.post('/register', authWriteRateLimiter, validateRegister, register);
authRouter.post('/login', authWriteRateLimiter, validateLogin, login);
authRouter.get('/me', authReadRateLimiter, authenticate, me);
authRouter.post('/refresh', authReadRateLimiter, verifyCsrf, refresh);
authRouter.post('/logout', authReadRateLimiter, verifyCsrf, logout);

export { authRouter };
