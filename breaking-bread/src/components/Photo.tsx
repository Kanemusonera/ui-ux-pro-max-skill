import Image from "next/image";
import type { Photo as PhotoT, Tone } from "@/lib/types";
import { TONES } from "@/lib/tones";
import { LogoMark } from "./Logo";

interface Props {
  photo?: PhotoT;
  tone: Tone;
  /** What the photograph will show; used for the placeholder caption and alt text. */
  subject: string;
  sizes: string;
  priority?: boolean;
  /** Show the "photograph to come" caption on placeholders. */
  caption?: boolean;
  className?: string;
}

/**
 * Fills its (relatively positioned) parent. Renders the real photograph when one
 * is set in /content, otherwise an art-directed placeholder in the dish's tone.
 */
export function Photo({ photo, tone, subject, sizes, priority, caption = true, className = "" }: Props) {
  if (photo) {
    return (
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }
  const t = TONES[tone];
  return (
    <div
      role="img"
      aria-label={`Photograph placeholder: ${subject}`}
      className={`grain absolute inset-0 overflow-hidden ${className}`}
      style={{
        backgroundColor: t.base,
        backgroundImage: `radial-gradient(120% 90% at 28% 22%, ${t.light} 0%, transparent 62%)`,
      }}
    >
      <LogoMark className="absolute left-1/2 top-1/2 h-[38%] max-h-56 w-auto -translate-x-1/2 -translate-y-1/2 text-cream/[0.07]" />
      {caption && (
        <span className="label absolute bottom-3 right-3 text-[0.625rem] text-cream/60">Photograph to come</span>
      )}
    </div>
  );
}
