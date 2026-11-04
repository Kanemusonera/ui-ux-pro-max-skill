/** Content model. Everything the site shows comes from /content — see README. */

export type Difficulty = "Easy" | "Medium" | "Challenging";

/** Mood colour used for the art-directed placeholder until a real photograph is added. */
export type Tone =
  | "ember"
  | "oxblood"
  | "tomato"
  | "ochre"
  | "char"
  | "butter"
  | "herb"
  | "toffee"
  | "sea"
  | "olive";

export interface Photo {
  /** Path under /public, e.g. "/images/recipes/short-ribs.jpg". */
  src: string;
  alt: string;
  /** Optional photo credit shown as a caption. */
  credit?: string;
  width?: number;
  height?: number;
}

export interface IngredientGroup {
  group?: string;
  items: { quantity?: string; item: string; note?: string }[];
}

export interface MethodStep {
  title?: string;
  text: string;
}

export interface Recipe {
  slug: string;
  title: string;
  /** One or two lines for cards and meta descriptions. */
  description: string;
  /** Longer introduction, one string per paragraph. */
  intro: string[];
  /** Category slugs from content/categories.json. The first is the primary category. */
  categories: string[];
  prepMinutes: number;
  cookMinutes: number;
  /** Proving, marinating, resting etc. Optional. */
  restMinutes?: number;
  servings: string;
  difficulty: Difficulty;
  cuisine?: string;
  tags?: string[];
  publishedAt: string;
  featured?: boolean;
  tone: Tone;
  image?: Photo;
  ingredients: IngredientGroup[];
  method: MethodStep[];
  tips?: string[];
  substitutions?: { swap: string; note: string }[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  tone: Tone;
  image?: Photo;
}

export type JournalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string };

export interface JournalEntry {
  slug: string;
  title: string;
  excerpt: string;
  kind: string;
  publishedAt: string;
  readMinutes: number;
  tone: Tone;
  image?: Photo;
  body: JournalBlock[];
  relatedRecipes?: string[];
}

export interface Video {
  title: string;
  /** Full TikTok video URL, e.g. https://www.tiktok.com/@handle/video/1234567890. Leave empty until posted. */
  url: string;
  caption?: string;
  recipeSlug?: string;
  tone: Tone;
  poster?: Photo;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  strapline: string;
  description: string;
  url: string;
  email: string;
  social: { tiktok: string; tiktokHandle: string; instagram: string; instagramHandle: string };
  hero: { tone: Tone; image?: Photo };
  about: { tone: Tone; image?: Photo };
}

export interface SearchItem {
  type: "recipe" | "journal";
  slug: string;
  title: string;
  description: string;
  meta: string;
  haystack: string;
}
