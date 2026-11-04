import Link from "next/link";
import { Photo } from "@/components/Photo";
import { RecipeCard } from "@/components/RecipeCard";
import { SectionHeading } from "@/components/SectionHeading";
import { NewsletterForm } from "@/components/NewsletterForm";
import { VideoGrid } from "@/components/VideoGrid";
import { LogoMark } from "@/components/Logo";
import { ArrowRight } from "@/components/Icons";
import { getCategories, getJournal, getRecipes, getSite, getVideos } from "@/lib/content";
import { formatDate } from "@/lib/format";

export default function HomePage() {
  const site = getSite();
  const recipes = getRecipes();
  const categories = getCategories();
  const journal = getJournal();
  const videos = getVideos();
  const catName = new Map(categories.map((c) => [c.slug, c.name]));
  const featured = recipes.filter((r) => r.featured).slice(0, 6);
  const [lead, ...rest] = featured;
  const [leadArticle, ...moreArticles] = journal;

  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-title" className="relative isolate flex min-h-[calc(100svh-4rem)] items-end overflow-hidden bg-ink text-cream md:min-h-[calc(100svh-5rem)]">
        <div className="absolute inset-0 -z-10">
          <Photo photo={site.hero.image} tone={site.hero.tone} subject="A home-cooked meal shared at the table" sizes="100vw" priority caption={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        </div>
        <div className="container-x pb-12 pt-32 md:pb-20">
          <p className="label text-bronze">Recipes · Food Journal · Cooking videos</p>
          <h1 id="hero-title" className="display mt-5 text-[clamp(3.4rem,15vw,11.5rem)] font-semibold uppercase tracking-[0.02em]">
            Breaking
            <br />
            Bread
          </h1>
          <div className="mt-6 grid gap-8 md:mt-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="font-serif text-3xl leading-tight md:text-4xl">{site.tagline}</p>
              <p className="mt-3 max-w-md text-lg italic text-cream/80">“{site.strapline}”</p>
            </div>
            <div className="md:col-span-5 md:flex md:justify-end">
              <Link href="/recipes" className="btn btn-light w-full sm:w-auto">
                Explore recipes <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
        {!site.hero.image && (
          <span className="label absolute right-4 top-4 text-[0.625rem] text-cream/70 md:right-8">Hero photograph to come</span>
        )}
      </section>

      {/* MANIFESTO */}
      <section className="bg-cream">
        <div className="container-x grid gap-6 py-16 md:grid-cols-12 md:py-24">
          <p className="label text-bronze-deep md:col-span-3">The kitchen</p>
          <p className="display text-[2.1rem] leading-[1.1] md:col-span-9 md:text-6xl">
            Slow Sundays, loud tables and second helpings. Generous food with big flavours, cooked at home and{" "}
            <em className="text-bronze-deep">made to be shared.</em>
          </p>
        </div>
      </section>

      {/* FEATURED RECIPES */}
      <section aria-labelledby="featured" className="container-x py-16 md:py-24">
        <SectionHeading id="featured" eyebrow="Featured recipes" title="From the kitchen" link={{ href: "/recipes", label: "All recipes" }} />
        {lead && (
          <div className="mt-10 grid gap-x-8 gap-y-14 md:mt-14 md:grid-cols-12">
            <div className="md:col-span-7">
              <RecipeCard recipe={lead} categoryName={catName.get(lead.categories[0])} variant="lead" index={0} priority />
            </div>
            <div className="grid content-between gap-y-14 md:col-span-5">
              {rest.slice(0, 2).map((r, i) => (
                <RecipeCard key={r.slug} recipe={r} categoryName={catName.get(r.categories[0])} index={i + 1} variant="side" />
              ))}
            </div>
          </div>
        )}
        {rest.length > 2 && (
          <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(2).map((r, i) => (
              <li key={r.slug}>
                <RecipeCard recipe={r} categoryName={catName.get(r.categories[0])} index={i + 3} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* CATEGORIES */}
      <section aria-labelledby="categories" className="bg-cream py-16 md:py-24">
        <div className="container-x">
          <SectionHeading id="categories" eyebrow="Explore by category" title="What are you cooking?" />
          <ul className="mt-10 grid grid-cols-2 gap-3 md:mt-14 lg:grid-cols-4 lg:gap-4">
            {categories.map((c, i) => {
              const count = recipes.filter((r) => r.categories.includes(c.slug)).length;
              const big = i === 0;
              return (
                <li key={c.slug} className={big ? "col-span-2" : ""}>
                  <Link
                    href={`/recipes?category=${c.slug}`}
                    className={`group relative flex overflow-hidden bg-ink text-cream ${big ? "aspect-[2/1] lg:aspect-auto lg:h-full" : "aspect-square"}`}
                  >
                    <Photo photo={c.image} tone={c.tone} subject={c.name} sizes="(min-width: 1024px) 25vw, 50vw" caption={false} className="transition-transform duration-700 group-hover:scale-[1.04]" />
                    <span className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                    <span className="relative mt-auto flex w-full items-end justify-between gap-2 p-4 md:p-6">
                      <span>
                        <span className={`display block ${big ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"}`}>{c.name}</span>
                        <span className="label mt-2 block text-[0.625rem] text-cream/70">
                          {count} {count === 1 ? "recipe" : "recipes"}
                        </span>
                      </span>
                      <ArrowRight className="mb-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* FOOD JOURNAL */}
      {leadArticle && (
        <section aria-labelledby="journal" className="bg-ink py-16 text-cream md:py-24">
          <div className="container-x">
            <SectionHeading id="journal" eyebrow="Food Journal" title="Notes from the stove" link={{ href: "/journal", label: "Read the journal" }} light />
            <div className="mt-10 grid gap-12 md:mt-14 md:grid-cols-12 md:gap-8">
              <article className="group relative md:col-span-7">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Photo photo={leadArticle.image} tone={leadArticle.tone} subject={leadArticle.title} sizes="(min-width: 768px) 58vw, 100vw" className="transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <p className="label mt-6 text-bronze">{leadArticle.kind}</p>
                <h3 className="display mt-3 text-4xl md:text-5xl">
                  <Link href={`/journal/${leadArticle.slug}`} className="link-underline after:absolute after:inset-0">
                    {leadArticle.title}
                  </Link>
                </h3>
                <p className="mt-4 max-w-xl text-lg text-mist">{leadArticle.excerpt}</p>
              </article>
              <ul className="divide-y divide-cream/15 border-y border-cream/15 md:col-span-5 md:self-start">
                {moreArticles.map((a) => (
                  <li key={a.slug}>
                    <article className="group relative py-7">
                      <p className="label text-[0.6875rem] text-bronze">
                        {a.kind} · {a.readMinutes} min read
                      </p>
                      <h3 className="display mt-3 text-3xl">
                        <Link href={`/journal/${a.slug}`} className="link-underline after:absolute after:inset-0">
                          {a.title}
                        </Link>
                      </h3>
                      <p className="mt-3 text-mist">{a.excerpt}</p>
                      <p className="mt-4 text-sm text-mist/80">{formatDate(a.publishedAt)}</p>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* VIDEOS */}
      <section aria-labelledby="videos" className="bg-ink-2 py-16 text-cream md:py-24">
        <div className="container-x">
          <SectionHeading id="videos" eyebrow="Latest cooking videos" title="Watch it come together" light />
          <div className="mt-10 md:mt-14">
            <VideoGrid videos={videos} profileUrl={site.social.tiktok} />
          </div>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" className="btn btn-light">
              Follow on TikTok {site.social.tiktokHandle}
            </a>
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
              Instagram {site.social.instagramHandle}
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section aria-labelledby="about" className="container-x grid gap-10 py-16 md:grid-cols-12 md:gap-8 md:py-28">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink md:col-span-5">
          <Photo photo={site.about.image} tone={site.about.tone} subject="The Breaking Bread kitchen" sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
        <div className="md:col-span-6 md:col-start-7 md:self-center">
          <LogoMark className="h-10 w-10 text-bronze-deep" />
          <p className="label mt-8 text-bronze-deep">About Breaking Bread</p>
          <h2 id="about" className="display mt-4 text-5xl md:text-6xl">
            More than a recipe.
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-stone">
            <p>
              Breaking Bread is about the whole experience of food: the creativity of building a dish, the pleasure of good
              ingredients treated well, and the moment everyone sits down together.
            </p>
            <p>
              The name means exactly what it says, sharing a meal, with a quieter nod to the fellowship and gratitude that have
              always gathered around the table. Cook generously. Pull up a chair.
            </p>
          </div>
          <Link href="/about" className="btn btn-outline mt-10">
            Our story <ArrowRight />
          </Link>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section aria-labelledby="newsletter" className="bg-cream">
        <div className="container-x grid gap-8 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-6">
            <p className="label text-bronze-deep">The Breaking Bread letter</p>
            <h2 id="newsletter" className="display mt-4 text-5xl md:text-6xl">
              New recipes, straight to your inbox.
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:self-end">
            <p className="mb-6 text-lg text-stone">
              Fresh recipes, kitchen notes and the occasional Sunday menu. No spam, no fuss.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
