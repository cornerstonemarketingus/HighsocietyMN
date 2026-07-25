export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-11 w-11 items-center justify-center text-indigo-700 ${className}`}
    >
      <svg viewBox="6 4 36 30" className="h-full w-full" fill="none">
        <circle cx="10" cy="12" r="2.25" fill="currentColor" />
        <circle cx="24" cy="6.5" r="2.5" fill="currentColor" />
        <circle cx="38" cy="12" r="2.25" fill="currentColor" />
        <path
          d="M10 15.5 15.5 26 24 10.5 32.5 26 38 15.5 35 31H13L10 15.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
