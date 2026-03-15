import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

const primaryClasses =
  'inline-flex min-h-12 items-center justify-center rounded-2xl bg-ink px-5 text-sm font-semibold tracking-wide text-white transition hover:bg-[#243434] disabled:cursor-not-allowed disabled:opacity-60';

const secondaryClasses =
  'inline-flex min-h-12 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-white/70 px-5 text-sm font-semibold tracking-wide text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60';

export const Button = ({ children, className = '', variant = 'primary', ...props }: ButtonProps) => {
  const classes = variant === 'primary' ? primaryClasses : secondaryClasses;
  const mergedClassName = `${classes} ${className}`.trim();

  return (
    <button className={mergedClassName} {...props}>
      {children}
    </button>
  );
};
