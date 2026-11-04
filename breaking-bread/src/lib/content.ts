import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Category, JournalEntry, Recipe, SearchItem, SiteSettings, Video } from "./types";
import { formatMinutes, normalise } from "./format";

const CONTENT = path.join(process.cwd(), "content");

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(CONTENT, file), "utf8")) as T;
}

function readDir<T extends { slug: string }>(dir: string): T[] {
  const full = path.join(CONTENT, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const data = readJson<T>(path.join(dir, f));
      const expected = f.replace(/\.json$/, "");
      if (data.slug !== expected) {
        throw new Error(`content/${dir}/${f}: "slug" must match the file name ("${expected}")`);
      }
      return data;
    });
}

const byDateDesc = (a: { publishedAt: string }, b: { publishedAt: string }) =>
  b.publishedAt.localeCompare(a.publishedAt);

export const getSite = () => readJson<SiteSettings>("site.json");
export const getCategories = () => readJson<Category[]>("categories.json");
export const getVideos = () => readJson<Video[]>("videos.json");

export function getRecipes(): Recipe[] {
  const cats = new Set(getCategories().map((c) => c.slug));
  const recipes = readDir<Recipe>("recipes").sort(byDateDesc);
  for (const r of recipes) {
    for (const c of r.categories) {
      if (!cats.has(c)) throw new Error(`Recipe "${r.slug}" uses unknown category "${c}"`);
    }
  }
  return recipes;
}

export const getRecipe = (slug: string) => getRecipes().find((r) => r.slug === slug);

export const getJournal = () => readDir<JournalEntry>("journal").sort(byDateDesc);
export const getJournalEntry = (slug: string) => getJournal().find((j) => j.slug === slug);

export function getCategory(slug: string) {
  return getCategories().find((c) => c.slug === slug);
}

export function getRelatedRecipes(recipe: Recipe, limit = 3): Recipe[] {
  return getRecipes()
    .filter((r) => r.slug !== recipe.slug)
    .map((r) => ({ r, score: r.categories.filter((c) => recipe.categories.includes(c)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ r }) => r);
}

export function getSearchIndex(): SearchItem[] {
  const cats = new Map(getCategories().map((c) => [c.slug, c.name]));
  const recipes: SearchItem[] = getRecipes().map((r) => ({
    type: "recipe",
    slug: r.slug,
    title: r.title,
    description: r.description,
    meta: `${cats.get(r.categories[0]) ?? ""} · ${formatMinutes(r.prepMinutes + r.cookMinutes)}`,
    haystack: normalise(
      [
        r.title,
        r.description,
        r.cuisine,
        ...(r.tags ?? []),
        ...r.categories.map((c) => cats.get(c)),
        ...r.ingredients.flatMap((g) => g.items.map((i) => i.item)),
      ].join(" "),
    ),
  }));
  const journal: SearchItem[] = getJournal().map((j) => ({
    type: "journal",
    slug: j.slug,
    title: j.title,
    description: j.excerpt,
    meta: `Journal · ${j.kind}`,
    haystack: normalise([j.title, j.excerpt, j.kind].join(" ")),
  }));
  return [...recipes, ...journal];
}
