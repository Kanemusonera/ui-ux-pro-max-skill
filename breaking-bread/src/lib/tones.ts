import type { Tone } from "./types";

/** Deep, food-led colours for placeholders. Each is a single lit surface, not a decorative gradient. */
export const TONES: Record<Tone, { base: string; light: string }> = {
  ember: { base: "#2a1a12", light: "#7a4325" },
  oxblood: { base: "#24110f", light: "#6e2a20" },
  tomato: { base: "#2b120c", light: "#8a3320" },
  ochre: { base: "#2a2114", light: "#8a6a3a" },
  char: { base: "#151311", light: "#4a423a" },
  butter: { base: "#2c2416", light: "#9a7f4a" },
  herb: { base: "#141b15", light: "#3f5640" },
  toffee: { base: "#22140b", light: "#7b4a22" },
  sea: { base: "#11181a", light: "#3b5458" },
  olive: { base: "#1b1c12", light: "#5c5f36" },
};
