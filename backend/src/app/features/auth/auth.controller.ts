import type { Request, Response } from 'express';
import { env } from '../../common/config/env.js';
import { asyncHandler } from '../../common/helpers/async-handler.js';
import {
  getPublicCookieOptions,
  getRefreshCookieOptions
} from '../../common/helpers/security.js';
import { AuthService } from './auth.service.js';

const authService = new AuthService();

const setSessionCookies = (res: Response, refreshToken: string, csrfToken: string) => {
  res.cookie(env.REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
  res.cookie(env.CSRF_COOKIE_NAME, csrfToken, getPublicCookieOptions(env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60));
  res.cookie(env.AUTH_HINT_COOKIE_NAME, '1', getPublicCookieOptions(env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60));
};

const clearSessionCookies = (res: Response) => {
  const refreshOptions = getRefreshCookieOptions();
  const publicOptions = getPublicCookieOptions(1);

  res.clearCookie(env.REFRESH_COOKIE_NAME, {
    httpOnly: refreshOptions.httpOnly,
    sameSite: refreshOptions.sameSite,
    secure: refreshOptions.secure,
    path: refreshOptions.path
  });
  res.clearCookie(env.CSRF_COOKIE_NAME, {
    httpOnly: publicOptions.httpOnly,
    sameSite: publicOptions.sameSite,
    secure: publicOptions.secure,
    path: publicOptions.path
  });
  res.clearCookie(env.AUTH_HINT_COOKIE_NAME, {
    httpOnly: publicOptions.httpOnly,
    sameSite: publicOptions.sameSite,
    secure: publicOptions.secure,
    path: publicOptions.path
  });
};

const setNoStore = (res: Response) => {
  res.setHeader('Cache-Control', 'no-store');
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  setNoStore(res);

  res.status(201).json({
    success: true,
    user
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const session = await authService.login(req.body);
  setSessionCookies(res, session.refreshToken, session.csrfToken);
  setNoStore(res);

  res.status(200).json({
    success: true,
    accessToken: session.accessToken,
    user: session.user
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getAuthenticatedUser(req.auth!.sub);
  setNoStore(res);

  res.status(200).json({
    success: true,
    user
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies[env.REFRESH_COOKIE_NAME] as string | undefined;
  const session = await authService.refreshSession(refreshToken ?? '');

  setSessionCookies(res, session.refreshToken, session.csrfToken);
  setNoStore(res);

  res.status(200).json({
    success: true,
    accessToken: session.accessToken,
    user: session.user
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies[env.REFRESH_COOKIE_NAME] as string | undefined;
  const accessToken = req.headers.authorization;

  await authService.logout(accessToken, refreshToken);
  clearSessionCookies(res);
  setNoStore(res);

  res.status(200).json({
    success: true
  });
});
