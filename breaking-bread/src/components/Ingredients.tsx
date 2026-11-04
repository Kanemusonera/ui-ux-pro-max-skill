"use client";

import { useState } from "react";
import type { IngredientGroup } from "@/lib/types";
import { CheckIcon } from "./Icons";

/** Tap-to-tick ingredient list — handy when cooking from a phone. */
export function Ingredients({ groups }: { groups: IngredientGroup[] }) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const toggle = (k: string) =>
    setDone((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  return (
    <div className="space-y-8">
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.group && <h3 className="label text-bronze-deep">{g.group}</h3>}
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {g.items.map((it, ii) => {
              const k = `${gi}-${ii}`;
              const checked = done.has(k);
              return (
                <li key={k}>
                  <label className="flex min-h-12 cursor-pointer items-start gap-3 py-3">
                    <input type="checkbox" className="peer sr-only" checked={checked} onChange={() => toggle(k)} />
                    <span
                      aria-hidden
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze print:hidden ${
                        checked ? "border-ink bg-ink text-cream" : "border-ink/40"
                      }`}
                    >
                      {checked && <CheckIcon className="h-3.5 w-3.5" />}
                    </span>
                    <span className={`text-[1.0625rem] leading-snug ${checked ? "text-stone line-through" : ""}`}>
                      {it.quantity && <strong className="font-semibold">{it.quantity} </strong>}
                      {it.item}
                      {it.note && <span className="text-stone">, {it.note}</span>}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
