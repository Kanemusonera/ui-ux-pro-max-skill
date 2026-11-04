import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/Photo";
import { LogoMark } from "@/components/Logo";
import { ArrowRight } from "@/components/Icons";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Breaking Bread is about more than cooking: creativity, good ingredients, bringing people together and the joy of sharing food.",
  alternates: { canonical: "/about" },
};

const PILLARS = [
  { n: "01", title: "Big flavours", text: "Proper seasoning, a hard sear, a sauce reduced until it shines. We'd rather cook one thing brilliantly than ten things fine." },
  { n: "02", title: "Good ingredients", text: "Nothing precious. Just ingredients chosen with care and treated well: a decent cut of meat, ripe tomatoes, real butter." },
  { n: "03", title: "Food for the table", text: "Most of what we cook is made to be shared. Big trays, slow braises and loaves you tear rather than slice." },
];

export default function AboutPage() {
  const site = getSite();
  return (
    <>
      <section className="bg-ink text-cream">
        <div className="container-x grid gap-10 pb-16 pt-12 md:grid-cols-12 md:pb-24 md:pt-20">
          <div className="md:col-span-7">
            <p className="label text-bronze">About Breaking Bread</p>
            <h1 className="display mt-5 text-[clamp(3rem,10vw,7rem)]">More than a recipe.</h1>
            <p className="mt-8 max-w-xl font-serif text-2xl leading-snug text-cream/85 md:text-3xl">{site.strapline}</p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden md:col-span-5">
            <Photo photo={site.about.image} tone={site.about.tone} subject="The Breaking Bread kitchen" sizes="(min-width: 768px) 40vw, 100vw" priority />
          </div>
        </div>
      </section>

      <section className="container-x grid gap-10 py-16 md:grid-cols-12 md:py-24">
        <p className="label text-bronze-deep md:col-span-3">The idea</p>
        <div className="space-y-6 text-lg leading-relaxed text-stone md:col-span-8">
          <p className="font-serif text-3xl leading-snug text-ink md:text-4xl">
            Breaking Bread started with a simple belief: that cooking is one of the best things we can do for the people we love.
          </p>
          <p>
            It's about the creativity of building a dish, the satisfaction of a sauce that comes together, and the pleasure of
            ingredients treated well. Most of all, it's about what happens after: everyone around the table, plates passed
            hand to hand, conversations that run long after the food is gone.
          </p>
          <p>
            The name has two meanings for us. The first is the obvious one, sharing a meal. The second is quieter: breaking bread
            has long been a picture of fellowship and gratitude in the Christian tradition, of people gathered around a simple
            table and finding something bigger there. That spirit of thankfulness and an open table sits underneath everything we
            cook.
          </p>
          <p>
            Here you'll find the recipes we cook at home, from slow Sunday braises to twenty-minute weeknight wins, plus a journal
            of techniques, ingredients and kitchen experiments. Everything is tested, written to be followed on a phone at the
            stove, and made to be shared.
          </p>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <div className="container-x">
          <div className="flex items-center gap-4 border-t border-ink pt-6">
            <LogoMark className="h-8 w-8 text-bronze-deep" />
            <h2 className="display text-4xl md:text-5xl">What we cook by</h2>
          </div>
          <ul className="mt-10 grid gap-10 md:grid-cols-3">
            {PILLARS.map((p) => (
              <li key={p.n}>
                <p className="label text-bronze-deep">{p.n}</p>
                <h3 className="display mt-3 text-3xl">{p.title}</h3>
                <p className="mt-3 text-stone">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x flex flex-col items-start gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-24">
        <h2 className="display max-w-2xl text-5xl md:text-6xl">Pull up a chair. There's always room.</h2>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/recipes" className="btn btn-dark">
            Explore recipes <ArrowRight />
          </Link>
          <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            Follow on TikTok
          </a>
        </div>
      </section>
    </>
  );
}
