import type { InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const inputClasses =
  'min-h-12 w-full rounded-2xl border border-[color:var(--border)] bg-white/80 px-4 text-sm text-ink outline-none transition placeholder:text-[color:var(--muted)] focus:border-ink focus:bg-white';

const labelClasses = 'mb-2 block text-sm font-semibold text-ink';
const errorClasses = 'mt-2 text-sm text-[color:var(--danger)]';

export const TextField = ({ error, label, ...props }: TextFieldProps) => {
  const errorElement = error ? <p className={errorClasses}>{error}</p> : null;

  return (
    <label className="block">
      <span className={labelClasses}>{label}</span>
      <input className={inputClasses} {...props} />
      {errorElement}
    </label>
  );
};
