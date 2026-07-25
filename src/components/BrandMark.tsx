export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-700 text-[10px] font-black tracking-[-0.08em] text-white shadow-sm ${className}`}
    >
      <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full" fill="none">
        <path d="M8 12 12 7l6 5 6-5 4 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity=".75" />
        <path d="M9 14h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity=".75" />
      </svg>
      <span className="mt-2">HS</span>
    </span>
  );
}
