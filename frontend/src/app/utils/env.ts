const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is required');
}

export const clientEnv = {
  apiBaseUrl,
  authHintCookieName: process.env.NEXT_PUBLIC_AUTH_HINT_COOKIE_NAME ?? 'auth_hint',
  csrfCookieName: process.env.NEXT_PUBLIC_CSRF_COOKIE_NAME ?? 'csrf_token'
};
