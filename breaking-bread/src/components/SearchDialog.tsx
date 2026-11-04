"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SearchItem } from "@/lib/types";
import { matches } from "@/lib/format";
import { ArrowRight, CloseIcon, SearchIcon } from "./Icons";

const SUGGESTIONS = ["Beef", "Chicken", "Pasta", "Sunday", "Garlic", "Bread"];

export function SearchDialog({
  open,
  onClose,
  index,
}: {
  open: boolean;
  onClose: () => void;
  index: SearchItem[];
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [q, setQ] = useState("");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      requestAnimationFrame(() => input.current?.focus());
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  const results = useMemo(() => (q.trim() ? index.filter((i) => matches(i.haystack, q)).slice(0, 8) : []), [q, index]);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label="Search"
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-ink/80 md:mx-auto md:mt-[10vh] md:h-auto md:max-w-2xl"
    >
      <div className="flex h-full flex-col bg-paper text-ink md:h-auto md:max-h-[75vh]">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            go(`/recipes?q=${encodeURIComponent(q.trim())}`);
          }}
          className="flex items-center gap-3 border-b border-line px-4 md:px-6"
        >
          <SearchIcon className="h-5 w-5 shrink-0 text-stone" />
          <label htmlFor="site-search" className="sr-only">
            Search recipes, ingredients and journal
          </label>
          <input
            ref={input}
            id="site-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search recipes, ingredients…"
            autoComplete="off"
            enterKeyHint="search"
            className="h-16 w-full bg-transparent font-serif text-2xl outline-none placeholder:text-stone/70 md:h-20 md:text-3xl"
          />
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center"
            aria-label="Close search"
          >
            <CloseIcon />
          </button>
        </form>

        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6" aria-live="polite">
          {!q.trim() && (
            <div>
              <p className="label text-stone">Try</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQ(s)}
                    className="min-h-11 border border-line px-4 text-sm transition-colors hover:border-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q.trim() && results.length === 0 && (
            <p className="text-stone">
              Nothing found for “{q}”. Try an ingredient, like <em>beef</em> or <em>garlic</em>.
            </p>
          )}

          {results.length > 0 && (
            <ul className="divide-y divide-line">
              {results.map((r) => {
                const href = `/${r.type === "recipe" ? "recipes" : "journal"}/${r.slug}`;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className="group flex items-center justify-between gap-4 py-4"
                    >
                      <span>
                        <span className="label block text-[0.6875rem] text-bronze-deep">{r.meta}</span>
                        <span className="mt-1 block font-serif text-2xl leading-tight">{r.title}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {q.trim() && (
            <button type="button" onClick={() => go(`/recipes?q=${encodeURIComponent(q.trim())}`)} className="btn btn-dark mt-6 w-full">
              See all recipe results
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
