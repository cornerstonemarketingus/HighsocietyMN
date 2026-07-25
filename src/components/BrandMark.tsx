export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-11 w-11 items-center justify-center text-indigo-700 ${className}`}
    >
      <svg viewBox="0 0 48 48" className="h-full w-full" fill="none">
        <circle cx="10" cy="12" r="2.25" fill="currentColor" />
        <circle cx="24" cy="6.5" r="2.5" fill="currentColor" />
        <circle cx="38" cy="12" r="2.25" fill="currentColor" />
        <path
          d="M10 15.5 15.5 26 24 10.5 32.5 26 38 15.5 35 31H13L10 15.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M13 31c7 3 15 3 22 0M16 36h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M19.5 42v-5M28.5 42v-5M19.5 39.5h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}
