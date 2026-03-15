import { clientEnv } from './env';

export const readCookie = (name: string) => {
  if (typeof document === 'undefined') {
    return null;
  }

  const segments = document.cookie.split(';');

  for (const segment of segments) {
    const [rawKey, ...rest] = segment.trim().split('=');

    if (rawKey === name) {
      return decodeURIComponent(rest.join('='));
    }
  }

  return null;
};

export const hasAuthHintCookie = () => {
  return Boolean(readCookie(clientEnv.authHintCookieName));
};

export const readCsrfToken = () => {
  return readCookie(clientEnv.csrfCookieName);
};
