import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/Photo";
import { getJournal } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Food Journal",
  description: "Cooking experiences, kitchen experiments, ingredients, techniques and food inspiration from the Breaking Bread kitchen.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const entries = getJournal();
  return (
    <div className="container-x pb-20 pt-12 md:pb-28 md:pt-20">
      <header className="mb-12 md:mb-16">
        <p className="label text-bronze-deep">Food Journal</p>
        <h1 className="display mt-4 text-6xl md:text-8xl">Notes from the stove</h1>
        <p className="mt-5 max-w-xl text-lg text-stone">
          Techniques, ingredients, kitchen experiments and the stories behind the food.
        </p>
      </header>
      <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2">
        {entries.map((e, i) => (
          <li key={e.slug} className={i === 0 ? "md:col-span-2" : ""}>
            <article className={`group relative grid gap-6 ${i === 0 ? "md:grid-cols-12 md:items-end md:gap-8" : ""}`}>
              <div className={`relative overflow-hidden bg-ink ${i === 0 ? "aspect-[3/2] md:col-span-7" : "aspect-[3/2]"}`}>
                <Photo photo={e.image} tone={e.tone} subject={e.title} priority={i === 0} sizes={i === 0 ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 50vw, 100vw"} className="transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <div className={i === 0 ? "md:col-span-5" : ""}>
                <p className="label text-bronze-deep">
                  {e.kind} · {e.readMinutes} min read
                </p>
                <h2 className={`display mt-3 ${i === 0 ? "text-5xl md:text-6xl" : "text-4xl"}`}>
                  <Link href={`/journal/${e.slug}`} className="link-underline after:absolute after:inset-0">
                    {e.title}
                  </Link>
                </h2>
                <p className="mt-4 text-lg text-stone">{e.excerpt}</p>
                <p className="mt-4 text-sm text-stone">{formatDate(e.publishedAt)}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
