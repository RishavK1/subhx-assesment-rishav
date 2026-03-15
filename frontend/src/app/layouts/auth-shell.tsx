import type { ReactNode } from 'react';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const AuthShell = ({ children, subtitle, title }: AuthShellProps) => {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10">
      <section className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex min-h-[540px] flex-col justify-between rounded-[32px] border border-white/40 bg-[color:rgba(23,33,33,0.92)] p-8 text-white shadow-panel sm:p-10">
          <div className="space-y-6">
            <p className="font-heading text-sm uppercase tracking-[0.45em] text-[color:rgba(255,255,255,0.62)]">
              Secure Auth Suite
            </p>
            <h1 className="max-w-xl font-heading text-4xl leading-tight sm:text-5xl">{title}</h1>
            <p className="max-w-lg text-base leading-7 text-[color:rgba(255,255,255,0.74)]">{subtitle}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-[color:rgba(255,255,255,0.45)]">Tokens</p>
              <p className="mt-3 text-lg font-semibold">Rotated refresh sessions with revocation in Redis</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-[color:rgba(255,255,255,0.45)]">Controls</p>
              <p className="mt-3 text-lg font-semibold">Rate limits, CSRF, allowlisted IPs, and cookie isolation</p>
            </div>
          </div>
        </div>
        <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-panel backdrop-blur xl:p-8">
          {children}
        </div>
      </section>
    </main>
  );
};
