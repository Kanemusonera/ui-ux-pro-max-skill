import type { MetadataRoute } from "next";
import { getJournal, getRecipes } from "@/lib/content";
import { absolute } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/recipes", "/journal", "/about", "/contact"].map((p) => ({
    url: absolute(p),
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : 0.8,
  }));
  const recipes = getRecipes().map((r) => ({ url: absolute(`/recipes/${r.slug}`), lastModified: r.publishedAt, priority: 0.9 }));
  const journal = getJournal().map((j) => ({ url: absolute(`/journal/${j.slug}`), lastModified: j.publishedAt, priority: 0.6 }));
  return [...pages, ...recipes, ...journal];
}
