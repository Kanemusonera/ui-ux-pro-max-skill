type P = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  viewBox: "0 0 24 24",
};

export const SearchIcon = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);
export const MenuIcon = ({ className = "h-6 w-6" }: P) => (
  <svg {...base} className={className}>
    <path d="M3 7h18M3 12h18M3 17h12" />
  </svg>
);
export const CloseIcon = ({ className = "h-6 w-6" }: P) => (
  <svg {...base} className={className}>
    <path d="m5 5 14 14M19 5 5 19" />
  </svg>
);
export const ArrowRight = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M4 12h16m-6-6 6 6-6 6" />
  </svg>
);
export const ClockIcon = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const PrintIcon = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M7 9V3.5h10V9M7 17H4.5V10a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v7H17" />
    <path d="M7 14h10v6.5H7z" />
  </svg>
);
export const ShareIcon = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}>
    <path d="M12 3.5v12M7.5 8 12 3.5 16.5 8" />
    <path d="M5 12.5v7h14v-7" />
  </svg>
);
export const PlayIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
  </svg>
);
export const CheckIcon = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} strokeWidth={2} className={className}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
