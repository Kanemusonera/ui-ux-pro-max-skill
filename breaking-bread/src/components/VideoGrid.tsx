"use client";

import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
import type { Video } from "@/lib/types";
import { Photo } from "./Photo";
import { PlayIcon } from "./Icons";

function tiktokId(url: string) {
  return url.match(/\/video\/(\d+)/)?.[1];
}

/**
 * Vertical video tiles. A tile with a TikTok URL loads the official embed on
 * tap (so TikTok's script never slows the first page load). A tile without a
 * URL yet links to the TikTok profile instead.
 */
export function VideoGrid({ videos, profileUrl }: { videos: Video[]; profileUrl: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
      {videos.map((v) => {
        const id = v.url ? tiktokId(v.url) : undefined;
        const playing = id && active === id;
        return (
          <li key={v.title} className="flex flex-col">
            <div className="relative aspect-[9/16] overflow-hidden bg-ink-2">
              {playing ? (
                <>
                  <blockquote className="tiktok-embed !m-0 h-full" cite={v.url} data-video-id={id} style={{ maxWidth: "100%", minWidth: 0 }}>
                    <section>
                      <a href={v.url} target="_blank" rel="noopener noreferrer">
                        {v.title}
                      </a>
                    </section>
                  </blockquote>
                  <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
                </>
              ) : (
                <>
                  <Photo photo={v.poster} tone={v.tone} subject={v.title} sizes="(min-width: 768px) 25vw, 50vw" caption={false} />
                  {id ? (
                    <button
                      type="button"
                      onClick={() => setActive(id)}
                      className="absolute inset-0 flex items-center justify-center"
                      aria-label={`Play “${v.title}”`}
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/90 text-ink">
                        <PlayIcon />
                      </span>
                    </button>
                  ) : (
                    <a
                      href={profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center"
                      aria-label={`Watch “${v.title}” on TikTok`}
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-cream/60 text-cream">
                        <PlayIcon />
                      </span>
                    </a>
                  )}
                  <span className="label pointer-events-none absolute left-3 top-3 text-[0.625rem] text-cream/80">TikTok</span>
                </>
              )}
            </div>
            <p className="mt-3 font-serif text-xl leading-snug text-cream">{v.title}</p>
            {v.recipeSlug && (
              <Link href={`/recipes/${v.recipeSlug}`} className="label mt-2 self-start text-[0.6875rem] text-bronze">
                <span className="link-underline">Get the recipe</span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
