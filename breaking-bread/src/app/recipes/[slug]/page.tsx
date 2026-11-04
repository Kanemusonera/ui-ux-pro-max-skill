import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Photo } from "@/components/Photo";
import { Ingredients } from "@/components/Ingredients";
import { RecipeActions } from "@/components/RecipeActions";
import { RecipeCard } from "@/components/RecipeCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getCategories, getRecipe, getRecipes, getRelatedRecipes, getSite } from "@/lib/content";
import { formatDate, formatMinutes, isoDuration } from "@/lib/format";
import { absolute } from "@/lib/seo";

export function generateStaticParams() {
  return getRecipes().map((r) => ({ slug: r.slug }));
}
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const recipe = getRecipe((await params).slug);
  if (!recipe) return {};
  return {
    title: recipe.title,
    description: recipe.description,
    alternates: { canonical: `/recipes/${recipe.slug}` },
    openGraph: {
      type: "article",
      title: recipe.title,
      description: recipe.description,
      url: `/recipes/${recipe.slug}`,
      ...(recipe.image && { images: [{ url: recipe.image.src, alt: recipe.image.alt }] }),
    },
  };
}

export default async function RecipePage({ params }: Params) {
  const recipe = getRecipe((await params).slug);
  if (!recipe) notFound();
  const site = getSite();
  const categories = getCategories();
  const catName = new Map(categories.map((c) => [c.slug, c.name]));
  const related = getRelatedRecipes(recipe);
  const url = absolute(`/recipes/${recipe.slug}`);
  const total = recipe.prepMinutes + recipe.cookMinutes + (recipe.restMinutes ?? 0);
  const primary = catName.get(recipe.categories[0]);

  const facts: [string, string][] = [
    ["Prep", formatMinutes(recipe.prepMinutes)],
    ["Cook", formatMinutes(recipe.cookMinutes)],
    ...(recipe.restMinutes ? ([["Rest / prove", formatMinutes(recipe.restMinutes)]] as [string, string][]) : []),
    ["Serves", recipe.servings],
    ["Difficulty", recipe.difficulty],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        name: recipe.title,
        description: recipe.description,
        image: [recipe.image ? absolute(recipe.image.src) : absolute(`/recipes/${recipe.slug}/opengraph-image`)],
        author: { "@type": "Organization", name: site.name, url: absolute("/") },
        publisher: { "@type": "Organization", name: site.name },
        datePublished: recipe.publishedAt,
        prepTime: isoDuration(recipe.prepMinutes),
        cookTime: isoDuration(recipe.cookMinutes),
        totalTime: isoDuration(total),
        recipeYield: recipe.servings,
        recipeCategory: primary,
        recipeCuisine: recipe.cuisine,
        keywords: (recipe.tags ?? []).join(", "),
        recipeIngredient: recipe.ingredients.flatMap((g) =>
          g.items.map((i) => [i.quantity, i.item, i.note && `(${i.note})`].filter(Boolean).join(" ")),
        ),
        recipeInstructions: recipe.method.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.text,
          url: `${url}#step-${i + 1}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absolute("/") },
          { "@type": "ListItem", position: 2, name: "Recipes", item: absolute("/recipes") },
          { "@type": "ListItem", position: 3, name: recipe.title, item: url },
        ],
      },
    ],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="bg-ink text-cream print:bg-white print:text-black">
        <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-[21/9] print:hidden">
          <Photo photo={recipe.image} tone={recipe.tone} subject={recipe.title} sizes="100vw" priority />
        </div>
        {recipe.image?.credit && <p className="container-x pt-2 text-xs text-mist print:hidden">Photo: {recipe.image.credit}</p>}
        <div className="container-x pb-10 pt-8 md:pb-14 md:pt-12">
          <nav aria-label="Breadcrumb" className="print:hidden">
            <ol className="label flex flex-wrap gap-2 text-[0.6875rem] text-mist">
              <li>
                <Link href="/recipes" className="link-underline">
                  Recipes
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={`/recipes?category=${recipe.categories[0]}`} className="link-underline text-bronze">
                  {primary}
                </Link>
              </li>
            </ol>
          </nav>
          <h1 className="display mt-5 max-w-5xl text-[clamp(2.75rem,9vw,6.5rem)]">{recipe.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-cream/80 md:text-xl print:text-black">{recipe.description}</p>

          <dl className="mt-10 grid grid-cols-2 border-t border-cream/15 sm:grid-cols-3 lg:grid-cols-5 print:border-black/20">
            {facts.map(([k, v]) => (
              <div key={k} className="border-b border-cream/15 py-4 pr-4 print:border-black/20">
                <dt className="label text-[0.6875rem] text-bronze print:text-black">{k}</dt>
                <dd className="mt-1.5 font-serif text-2xl">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="container-x py-10 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Intro + actions */}
          <div className="lg:col-span-7">
            <div className="space-y-5 text-lg leading-relaxed">
              {recipe.intro.map((p, i) => (
                <p key={i} className={i === 0 ? "font-serif text-2xl leading-snug md:text-[1.75rem]" : "text-stone"}>
                  {p}
                </p>
              ))}
            </div>
            <p className="mt-6 text-sm text-stone">Published {formatDate(recipe.publishedAt)}</p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <RecipeActions url={url} title={recipe.title} text={recipe.description} />
          </div>
        </div>

        <div className="mt-14 grid gap-14 border-t border-ink pt-10 md:mt-20 lg:grid-cols-12 lg:gap-10 print:mt-6 print:block">
          {/* Ingredients */}
          <section aria-labelledby="ingredients" className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 id="ingredients" className="display text-4xl md:text-5xl">
                Ingredients
              </h2>
              <p className="mb-6 mt-2 text-stone">Serves {recipe.servings}. Tap to tick off as you go.</p>
              <Ingredients groups={recipe.ingredients} />
            </div>
          </section>

          {/* Method */}
          <section aria-labelledby="method" className="lg:col-span-7 lg:col-start-6 print:mt-10">
            <h2 id="method" className="display text-4xl md:text-5xl">
              Method
            </h2>
            <ol className="mt-8 space-y-10">
              {recipe.method.map((step, i) => (
                <li key={i} id={`step-${i + 1}`} className="grid grid-cols-[2.75rem_1fr] gap-x-4 md:grid-cols-[4rem_1fr]">
                  <span className="display text-4xl text-bronze-deep md:text-5xl" aria-hidden>
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="label pt-2 text-ink">
                      <span className="sr-only">Step {i + 1}: </span>
                      {step.title ?? `Step ${i + 1}`}
                    </h3>
                    <p className="mt-2 text-[1.0625rem] leading-relaxed md:text-lg">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            {recipe.tips?.length ? (
              <section aria-labelledby="tips" className="mt-14 bg-cream p-6 md:p-8 print:border print:border-black/20 print:bg-white">
                <h2 id="tips" className="display text-3xl md:text-4xl">
                  Cook's tips
                </h2>
                <ul className="mt-5 space-y-4">
                  {recipe.tips.map((t, i) => (
                    <li key={i} className="flex gap-4 text-[1.0625rem] leading-relaxed">
                      <span className="mt-3 h-px w-5 shrink-0 bg-bronze-deep" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {recipe.substitutions?.length ? (
              <section aria-labelledby="subs" className="mt-12">
                <h2 id="subs" className="display text-3xl md:text-4xl">
                  Swaps &amp; substitutions
                </h2>
                <dl className="mt-5 divide-y divide-line border-y border-line">
                  {recipe.substitutions.map((s) => (
                    <div key={s.swap} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                      <dt className="font-semibold">{s.swap}</dt>
                      <dd className="text-stone">{s.note}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            <p className="mt-10 hidden text-sm print:block">
              Recipe from Breaking Bread — {url}
            </p>
          </section>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section aria-labelledby="related" className="bg-cream py-16 md:py-24 print:hidden">
          <div className="container-x">
            <div className="border-t border-ink pt-6">
              <p className="label text-bronze-deep">Keep cooking</p>
              <h2 id="related" className="display mt-3 text-5xl">
                You might also like
              </h2>
            </div>
            <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <RecipeCard recipe={r} categoryName={catName.get(r.categories[0])} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="recipe-newsletter" className="bg-ink py-16 text-cream md:py-20 print:hidden">
        <div className="container-x grid gap-8 md:grid-cols-12 md:items-end">
          <h2 id="recipe-newsletter" className="display text-4xl md:col-span-6 md:text-5xl">
            Enjoyed this? Get the next one first.
          </h2>
          <div className="md:col-span-5 md:col-start-8">
            <NewsletterForm light id="recipe-newsletter-email" />
          </div>
        </div>
      </section>
    </article>
  );
}
