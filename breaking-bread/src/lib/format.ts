export function formatMinutes(total: number): string {
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m ? `${h} hr ${m} min` : `${h} hr${h > 1 ? "s" : ""}`;
}

/** ISO 8601 duration for Schema.org, e.g. PT1H30M. */
export function isoDuration(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `PT${h ? `${h}H` : ""}${m || !h ? `${m}M` : ""}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function normalise(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every query word must appear somewhere in the haystack (prefix match per word). */
export function matches(haystack: string, query: string): boolean {
  const words = normalise(query).split(" ").filter(Boolean);
  if (!words.length) return true;
  const tokens = haystack.split(" ");
  return words.every((w) => haystack.includes(w) || tokens.some((t) => t.startsWith(w)));
}
