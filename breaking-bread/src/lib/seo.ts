export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://breakingbread.co.uk").replace(/\/$/, "");
export const absolute = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
