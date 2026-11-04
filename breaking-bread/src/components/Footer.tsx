import Link from "next/link";
import type { Category, SiteSettings } from "@/lib/types";
import { Logo } from "./Logo";

export function Footer({ site, categories }: { site: SiteSettings; categories: Category[] }) {
  return (
    <footer className="bg-ink text-cream print:hidden">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo />
          <p className="display mt-8 max-w-sm text-4xl text-cream">{site.tagline}</p>
          <p className="mt-4 max-w-sm text-mist">{site.strapline}</p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
          <div>
            <p className="label text-bronze">Explore</p>
            <ul className="mt-5 space-y-3">
              {[
                ["/recipes", "All recipes"],
                ["/journal", "Food Journal"],
                ["/about", "About"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="link-underline text-cream/85 hover:text-cream">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label text-bronze">Recipes</p>
            <ul className="mt-5 space-y-3">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/recipes?category=${c.slug}`} className="link-underline text-cream/85 hover:text-cream">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="label text-bronze">Follow</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" className="link-underline text-cream/85 hover:text-cream">
                  TikTok <span className="text-mist">{site.social.tiktokHandle}</span>
                </a>
              </li>
              <li>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="link-underline text-cream/85 hover:text-cream">
                  Instagram <span className="text-mist">{site.social.instagramHandle}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="link-underline text-cream/85 hover:text-cream">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col gap-2 py-6 text-sm text-mist md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Breaking Bread. All rights reserved.</p>
          <p>breakingbread.co.uk</p>
        </div>
      </div>
    </footer>
  );
}
