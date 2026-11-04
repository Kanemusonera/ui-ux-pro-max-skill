import type { Metadata } from "next";
import { Suspense } from "react";
import { RecipeExplorer } from "@/components/RecipeExplorer";
import { getCategories, getRecipes } from "@/lib/content";
import { normalise } from "@/lib/format";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Every Breaking Bread recipe in one place: slow braises, Sunday roasts, pasta, baking, desserts and quick weeknight dinners. Search by dish or ingredient.",
  alternates: { canonical: "/recipes" },
};

export default function RecipesPage() {
  const categories = getCategories();
  const catName = new Map(categories.map((c) => [c.slug, c.name]));
  const items = getRecipes().map((recipe) => ({
    recipe,
    haystack: normalise(
      [
        recipe.title,
        recipe.description,
        recipe.cuisine,
        ...(recipe.tags ?? []),
        ...recipe.categories.map((c) => catName.get(c)),
        ...recipe.ingredients.flatMap((g) => g.items.map((i) => i.item)),
      ].join(" "),
    ),
  }));

  return (
    <div className="container-x pb-20 pt-12 md:pb-28 md:pt-20">
      <header className="mb-10 md:mb-14">
        <p className="label text-bronze-deep">The recipe index</p>
        <h1 className="display mt-4 text-6xl md:text-8xl">Recipes</h1>
        <p className="mt-5 max-w-xl text-lg text-stone">
          Generous food with big flavours. Search by dish, ingredient or occasion, or browse by category.
        </p>
      </header>
      <Suspense fallback={null}>
        <RecipeExplorer items={items} categories={categories} />
      </Suspense>
    </div>
  );
}
