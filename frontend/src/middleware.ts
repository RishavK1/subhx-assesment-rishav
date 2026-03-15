import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const authHintCookieName = process.env.NEXT_PUBLIC_AUTH_HINT_COOKIE_NAME ?? 'auth_hint';
const protectedPaths = new Set(['/dashboard']);
const guestOnlyPaths = new Set(['/login', '/register']);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasSession = Boolean(request.cookies.get(authHintCookieName)?.value);
  const isProtectedPath = protectedPaths.has(pathname);
  const isGuestOnlyPath = guestOnlyPaths.has(pathname);

  if (isProtectedPath && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isGuestOnlyPath && hasSession) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/login', '/register']
};
