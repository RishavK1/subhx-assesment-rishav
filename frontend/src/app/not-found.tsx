import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/app/components/button';
import { appRoutes } from '@/app/router/routes';

const eyebrowClasses = 'font-heading text-sm uppercase tracking-[0.4em] text-[color:var(--accent)]';
const titleClasses = 'font-heading text-5xl leading-none text-ink sm:text-7xl';
const descriptionClasses = 'max-w-xl text-base leading-7 text-[color:var(--muted)]';
const panelClasses =
  'w-full rounded-[36px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-panel backdrop-blur sm:p-12';

export default async function NotFoundPage() {
  const cookieStore = await cookies();
  const authHintCookieName = process.env.NEXT_PUBLIC_AUTH_HINT_COOKIE_NAME ?? 'auth_hint';
  const isAuthenticated = Boolean(cookieStore.get(authHintCookieName)?.value);
  const description = isAuthenticated
    ? 'The path you requested does not exist. Return to the authenticated dashboard to continue using the app.'
    : 'The path you requested does not exist. Return to the login flow or create a new account from the expected entry points.';
  const actions = isAuthenticated ? (
    <Link href={appRoutes.dashboard}>
      <Button className="w-full sm:w-auto" type="button">
        Go to Dashboard
      </Button>
    </Link>
  ) : (
    <>
      <Link href={appRoutes.login}>
        <Button className="w-full sm:w-auto" type="button">
          Go to Login
        </Button>
      </Link>
      <Link href={appRoutes.register}>
        <Button className="w-full sm:w-auto" type="button" variant="secondary">
          Create Account
        </Button>
      </Link>
    </>
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10">
      <section className={panelClasses}>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="rounded-[32px] border border-white/40 bg-[color:rgba(23,33,33,0.95)] p-8 text-white">
            <p className="text-sm uppercase tracking-[0.45em] text-[color:rgba(255,255,255,0.58)]">Route Missing</p>
            <p className="mt-6 font-heading text-[7rem] leading-none sm:text-[9rem]">404</p>
            <p className="mt-6 max-w-sm text-base leading-7 text-[color:rgba(255,255,255,0.74)]">
              The path you requested does not exist in this authentication workspace.
            </p>
          </div>
          <div className="space-y-6">
            <p className={eyebrowClasses}>Not Found</p>
            <h1 className={titleClasses}>This page is outside the secure route map.</h1>
            <p className={descriptionClasses}>{description}</p>
            <div className="flex flex-col gap-3 sm:flex-row">{actions}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
