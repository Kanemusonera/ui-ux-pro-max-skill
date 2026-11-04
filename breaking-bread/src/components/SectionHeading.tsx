import Link from "next/link";
import { ArrowRight } from "./Icons";

export function SectionHeading({
  eyebrow,
  title,
  link,
  light = false,
  id,
}: {
  eyebrow: string;
  title: string;
  link?: { href: string; label: string };
  light?: boolean;
  id?: string;
}) {
  return (
    <div className={`flex flex-col gap-6 border-t pt-6 md:flex-row md:items-end md:justify-between ${light ? "border-cream/20" : "border-ink"}`}>
      <div>
        <p className={`label ${light ? "text-bronze" : "text-bronze-deep"}`}>{eyebrow}</p>
        <h2 id={id} className="display mt-3 text-5xl md:text-6xl">
          {title}
        </h2>
      </div>
      {link && (
        <Link href={link.href} className="label group inline-flex items-center gap-3 self-start md:self-auto">
          <span className="link-underline">{link.label}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
