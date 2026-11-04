import type { Recipe } from "@/lib/types";
import { formatMinutes } from "@/lib/format";

/** Prep · Cook · Difficulty, as a definition list. */
export function RecipeMeta({ recipe, tone = "dark", className = "" }: { recipe: Recipe; tone?: "dark" | "light"; className?: string }) {
  const items = [
    ["Prep", formatMinutes(recipe.prepMinutes)],
    ["Cook", formatMinutes(recipe.cookMinutes)],
    ["Level", recipe.difficulty],
  ];
  return (
    <dl className={`flex flex-wrap gap-x-5 gap-y-1 text-sm ${className}`}>
      {items.map(([k, v]) => (
        <div key={k} className="flex gap-1.5">
          <dt className={tone === "dark" ? "text-stone" : "text-mist"}>{k}</dt>
          <dd className="font-semibold">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
