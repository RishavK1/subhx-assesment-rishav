import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { appRoutes } from './router/routes';

export default async function HomePage() {
  const cookieStore = await cookies();
  const authHintCookieName = process.env.NEXT_PUBLIC_AUTH_HINT_COOKIE_NAME ?? 'auth_hint';
  const hasSession = Boolean(cookieStore.get(authHintCookieName)?.value);

  if (hasSession) {
    redirect(appRoutes.dashboard);
  }

  redirect(appRoutes.login);
}
