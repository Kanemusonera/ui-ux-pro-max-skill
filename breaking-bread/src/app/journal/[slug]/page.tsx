import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Photo } from "@/components/Photo";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeActions } from "@/components/RecipeActions";
import { getCategories, getJournal, getJournalEntry, getRecipe, getSite } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { absolute } from "@/lib/seo";
import type { Recipe } from "@/lib/types";

export function generateStaticParams() {
  return getJournal().map((j) => ({ slug: j.slug }));
}
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const entry = getJournalEntry((await params).slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.excerpt,
    alternates: { canonical: `/journal/${entry.slug}` },
    openGraph: { type: "article", title: entry.title, description: entry.excerpt, publishedTime: entry.publishedAt },
  };
}

export default async function JournalEntryPage({ params }: Params) {
  const entry = getJournalEntry((await params).slug);
  if (!entry) notFound();
  const site = getSite();
  const catName = new Map(getCategories().map((c) => [c.slug, c.name]));
  const related = (entry.relatedRecipes ?? []).map(getRecipe).filter((r): r is Recipe => Boolean(r));
  const url = absolute(`/journal/${entry.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.excerpt,
    datePublished: entry.publishedAt,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: url,
    image: entry.image ? absolute(entry.image.src) : absolute("/opengraph-image"),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="container-x pt-12 text-center md:pt-20">
        <p className="label text-bronze-deep">
          <Link href="/journal" className="link-underline">
            Food Journal
          </Link>{" "}
          · {entry.kind}
        </p>
        <h1 className="display mx-auto mt-5 max-w-4xl text-[clamp(2.75rem,8vw,5.75rem)]">{entry.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl font-serif text-2xl italic text-stone">{entry.excerpt}</p>
        <p className="mt-6 text-sm text-stone">
          {formatDate(entry.publishedAt)} · {entry.readMinutes} min read
        </p>
      </header>
      <div className="container-x mt-10 md:mt-14">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink sm:aspect-[16/9]">
          <Photo photo={entry.image} tone={entry.tone} subject={entry.title} sizes="(min-width: 1408px) 1312px, 100vw" priority />
        </div>
      </div>
      <div className="container-x">
        <div className="prose-bb mx-auto max-w-[42rem] py-10 md:py-16">
          {entry.body.map((b, i) => {
            if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
            if (b.type === "quote")
              return (
                <blockquote key={i}>
                  <p className="!m-0 !font-serif !text-[inherit] !leading-[inherit]">{b.text}</p>
                  {b.cite && <cite className="label mt-3 block not-italic text-stone">{b.cite}</cite>}
                </blockquote>
              );
            return <p key={i}>{b.text}</p>;
          })}
          <div className="mt-14 border-t border-line pt-8">
            <RecipeActions url={url} title={entry.title} text={entry.excerpt} printLabel="Print article" />
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section aria-labelledby="related" className="bg-cream py-16 md:py-24">
          <div className="container-x">
            <div className="border-t border-ink pt-6">
              <p className="label text-bronze-deep">Put it into practice</p>
              <h2 id="related" className="display mt-3 text-5xl">
                Recipes to try
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
    </article>
  );
}
