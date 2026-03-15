const wrapperClasses = 'flex min-h-[240px] items-center justify-center';
const pillClasses =
  'rounded-full border border-[color:var(--border)] bg-white/75 px-5 py-3 text-sm font-semibold tracking-[0.2em] text-[color:var(--muted)]';

export const PageLoader = () => {
  return (
    <div className={wrapperClasses}>
      <div className={pillClasses}>LOADING SESSION</div>
    </div>
  );
};
