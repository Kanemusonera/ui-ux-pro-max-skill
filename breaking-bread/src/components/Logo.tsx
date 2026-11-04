import Link from "next/link";

/**
 * The Breaking Bread mark: a round, scored loaf. The two scores form a
 * Latin cross — read as bread first, fellowship second.
 */
export function LogoMark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M32 11.5C34.4 24 34.4 41 32 54.5 29.6 41 29.6 24 32 11.5Z" fill="currentColor" />
      <path d="M17.5 26.5C26 24.4 38 24.4 46.5 26.5 38 28.6 26 28.6 17.5 26.5Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className = "", stacked = false }: { className?: string; stacked?: boolean }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${stacked ? "flex-col gap-3" : "gap-3"} ${className}`}
      aria-label="Breaking Bread — home"
    >
      <LogoMark className={stacked ? "h-12 w-12" : "h-8 w-8 md:h-9 md:w-9"} />
      <span
        className={`font-serif font-semibold uppercase leading-none ${
          stacked ? "text-2xl tracking-[0.22em]" : "text-[1.05rem] tracking-[0.2em] md:text-xl"
        }`}
      >
        Breaking Bread
      </span>
    </Link>
  );
}
