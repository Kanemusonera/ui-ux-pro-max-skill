import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/lib/og";

export const alt = "Breaking Bread — Good Food. Big Flavours.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard eyebrow="breakingbread.co.uk" title="Good Food. Big Flavours." subtitle="Bringing people together, one meal at a time." />,
    size,
  );
}
