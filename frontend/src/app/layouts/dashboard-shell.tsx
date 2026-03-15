import type { ReactNode } from 'react';
import Link from 'next/link';
import { appRoutes } from '../router/routes';

interface DashboardShellProps {
  children: ReactNode;
  action: ReactNode;
}

export const DashboardShell = ({ action, children }: DashboardShellProps) => {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-panel backdrop-blur sm:p-8">
        <header className="flex flex-col gap-6 border-b border-[color:var(--border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <p className="font-heading text-sm uppercase tracking-[0.4em] text-[color:var(--muted)]">Identity Console</p>
            <div>
              <h1 className="font-heading text-3xl text-ink">Authenticated profile</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
                Session bootstrap, access token retry, and protected navigation are active for this route.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[color:var(--border)] px-5 text-sm font-semibold text-ink transition hover:bg-white"
              href={appRoutes.home}
            >
              Home
            </Link>
            {action}
          </div>
        </header>
        <div className="pt-8">{children}</div>
      </div>
    </main>
  );
};
