import type { ReactNode } from 'react';

interface StatusBannerProps {
  children: ReactNode;
  tone?: 'error' | 'neutral' | 'success';
}

const toneClasses = {
  error: 'border-[color:rgba(140,59,47,0.2)] bg-[color:rgba(140,59,47,0.08)] text-[color:var(--danger)]',
  neutral: 'border-[color:var(--border)] bg-white/70 text-[color:var(--muted)]',
  success: 'border-[color:rgba(61,90,64,0.18)] bg-[color:rgba(61,90,64,0.1)] text-[color:var(--success)]'
};

export const StatusBanner = ({ children, tone = 'neutral' }: StatusBannerProps) => {
  const className = `rounded-2xl border px-4 py-3 text-sm ${toneClasses[tone]}`;

  return <div className={className}>{children}</div>;
};
