'use client';

import { Button } from '@/app/components/button';
import { StatusBanner } from '@/app/components/status-banner';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-10">
      <section className="w-full rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-panel">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="font-heading text-sm uppercase tracking-[0.4em] text-[color:var(--accent)]">Application Error</p>
            <h1 className="font-heading text-3xl text-ink">The client hit an unrecoverable state.</h1>
          </div>
          <StatusBanner tone="error">{error.message}</StatusBanner>
          <Button onClick={reset} type="button">
            Try again
          </Button>
        </div>
      </section>
    </main>
  );
}
