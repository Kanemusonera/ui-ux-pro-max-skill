import Link from "next/link";
import type { Recipe } from "@/lib/types";
import { Photo } from "./Photo";
import { RecipeMeta } from "./RecipeMeta";

interface Props {
  recipe: Recipe;
  categoryName?: string;
  variant?: "lead" | "standard" | "side";
  index?: number;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}

export function RecipeCard({ recipe, categoryName, variant = "standard", index, priority, headingLevel = "h3" }: Props) {
  const H = headingLevel;
  const lead = variant === "lead";
  return (
    <article className="group relative">
      <div
        className={`relative overflow-hidden bg-ink ${
          lead ? "aspect-[4/5] md:aspect-[5/4]" : variant === "side" ? "aspect-[4/5] md:aspect-[16/10]" : "aspect-[4/5]"
        }`}
      >
        <Photo
          photo={recipe.image}
          tone={recipe.tone}
          subject={recipe.title}
          priority={priority}
          sizes={lead ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {typeof index === "number" && (
          <span className="label absolute left-4 top-4 text-cream/80">{String(index + 1).padStart(2, "0")}</span>
        )}
      </div>
      <div className="pt-5">
        {categoryName && <p className="label text-bronze-deep">{categoryName}</p>}
        <H className={`display mt-2 ${lead ? "text-4xl md:text-5xl" : "text-3xl"}`}>
          <Link href={`/recipes/${recipe.slug}`} className="link-underline after:absolute after:inset-0">
            {recipe.title}
          </Link>
        </H>
        <p className={`mt-3 text-stone ${lead ? "max-w-xl text-lg" : ""}`}>{recipe.description}</p>
        <RecipeMeta recipe={recipe} className="mt-4" />
      </div>
    </article>
  );
}
