"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Category, Recipe } from "@/lib/types";
import { matches } from "@/lib/format";
import { RecipeCard } from "./RecipeCard";
import { SearchIcon } from "./Icons";

export interface ExplorerRecipe {
  recipe: Recipe;
  haystack: string;
}

export function RecipeExplorer({ items, categories }: { items: ExplorerRecipe[]; categories: Category[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(params.get("q") ?? "");
  const category = params.get("category") ?? "";
  /** The last query this component wrote to the URL, so URL changes we caused don't overwrite typing. */
  const written = useRef(q.trim());
  const latestCategory = useRef(category);
  latestCategory.current = category;

  // Pick up queries that arrive from outside (header search, back button).
  useEffect(() => {
    const fromUrl = params.get("q") ?? "";
    if (fromUrl !== written.current) {
      written.current = fromUrl;
      setQ(fromUrl);
    }
  }, [params]);

  const writeUrl = (next: { q: string; category: string }) => {
    const sp = new URLSearchParams();
    if (next.q.trim()) sp.set("q", next.q.trim());
    if (next.category) sp.set("category", next.category);
    written.current = next.q.trim();
    const s = sp.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  };

  // Debounce writing the query into the URL so results are shareable.
  useEffect(() => {
    if (q.trim() === written.current) return;
    const t = setTimeout(() => {
      if (q.trim() !== written.current) writeUrl({ q, category: latestCategory.current });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const catName = useMemo(() => new Map(categories.map((c) => [c.slug, c.name])), [categories]);
  const results = useMemo(
    () => items.filter((i) => (!category || i.recipe.categories.includes(category)) && matches(i.haystack, q)),
    [items, category, q],
  );
  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div>
      <div className="grid gap-6 border-b border-line pb-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <label htmlFor="recipe-search" className="label text-stone">
            Search recipes
          </label>
          <div className="mt-3 flex items-center gap-3 border-b-2 border-ink">
            <SearchIcon className="h-5 w-5 shrink-0 text-stone" />
            <input
              id="recipe-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Dish, ingredient or occasion"
              enterKeyHint="search"
              className="h-14 w-full bg-transparent font-serif text-2xl outline-none placeholder:text-stone/70"
            />
          </div>
        </div>
        <div className="lg:col-span-7">
          <p className="label text-stone" id="cat-label">
            Category
          </p>
          <div role="group" aria-labelledby="cat-label" className="mt-3 flex flex-wrap gap-2">
            {[{ slug: "", name: "All" }, ...categories].map((c) => {
              const on = c.slug === category;
              return (
                <button
                  key={c.slug || "all"}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    latestCategory.current = c.slug;
                    writeUrl({ q, category: c.slug });
                  }}
                  className={`min-h-11 border px-4 text-sm font-semibold transition-colors ${
                    on ? "border-ink bg-ink text-cream" : "border-ink/20 hover:border-ink"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-3 py-6" aria-live="polite">
        <p className="text-stone">
          <strong className="text-ink">{results.length}</strong> {results.length === 1 ? "recipe" : "recipes"}
          {activeCategory && <> in {activeCategory.name}</>}
          {q.trim() && <> matching “{q.trim()}”</>}
        </p>
        {(q || category) && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              writeUrl({ q: "", category: "" });
            }}
            className="label link-underline min-h-11"
          >
            Clear filters
          </button>
        )}
      </div>

      {activeCategory && <p className="-mt-2 mb-8 max-w-2xl font-serif text-2xl italic text-stone">{activeCategory.description}</p>}

      {results.length ? (
        <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(({ recipe }, i) => (
            <li key={recipe.slug}>
              <RecipeCard recipe={recipe} categoryName={catName.get(recipe.categories[0])} priority={i < 3} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="border border-line px-6 py-16 text-center">
          <p className="display text-4xl">Nothing on the menu for that.</p>
          <p className="mt-3 text-stone">Try a different ingredient or clear the filters.</p>
        </div>
      )}
    </div>
  );
}
