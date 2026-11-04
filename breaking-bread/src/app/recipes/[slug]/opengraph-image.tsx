import { ImageResponse } from "next/og";
import { getRecipe, getRecipes } from "@/lib/content";
import { formatMinutes } from "@/lib/format";
import { OgCard, OG_SIZE } from "@/lib/og";

export const alt = "Breaking Bread recipe";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getRecipes().map((r) => ({ slug: r.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const r = getRecipe((await params).slug);
  return new ImageResponse(
    <OgCard
      eyebrow="Recipe"
      title={r?.title ?? "Breaking Bread"}
      subtitle={r ? `${formatMinutes(r.prepMinutes + r.cookMinutes)} · Serves ${r.servings} · ${r.difficulty}` : undefined}
    />,
    size,
  );
}
