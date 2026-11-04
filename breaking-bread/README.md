# Breaking Bread — breakingbread.co.uk

*Good Food. Big Flavours.*

The website for Breaking Bread, built with Next.js 15 (App Router), TypeScript and Tailwind CSS v4. Every page is pre-rendered as static HTML. Only the contact and newsletter endpoints run on the server.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also validates all content)
npm start          # serve the production build
```

## Adding and editing content

All content lives in `/content` as plain JSON, kept separate from the design. You never need to touch the React code to publish something.

| What | Where |
| --- | --- |
| Recipes | `content/recipes/<slug>.json` (one file per recipe; the file name must match `slug`) |
| Food Journal articles | `content/journal/<slug>.json` |
| Categories | `content/categories.json` |
| TikTok videos | `content/videos.json` |
| Site name, tagline, email, social links, hero/about photos | `content/site.json` |

**New recipe:** copy any file in `content/recipes/`, rename it, change `slug` to match, and edit. Set `"featured": true` to show it on the homepage (the first six are used). Pages, search, category filters, the sitemap and the Google Recipe structured data all update automatically. The build fails with a clear message if a slug or category is wrong.

**Journal body blocks:** `{ "type": "p", "text": "…" }`, `{ "type": "h2", "text": "…" }` or `{ "type": "quote", "text": "…" }`.

**Videos:** paste the full TikTok URL (`https://www.tiktok.com/@you/video/123…`) into `url`. Tapping the tile then plays the official TikTok embed, which only loads on tap so it never slows the page. While `url` is empty, the tile links to your TikTok profile.

Publishing a change means committing it. With Vercel connected to the repo (below), every push goes live in about a minute. If you'd rather edit in a browser form than in JSON, a git-based CMS such as Decap CMS or TinaCMS can sit on top of these same files later.

## Photography

The site ships with **art-directed placeholders**: deep, dish-toned panels marked "Photograph to come". No stock or AI images are presented as your cooking. To add your own photos:

1. Export a JPG around 2400px on the long edge (Next.js generates the AVIF/WebP sizes for phones automatically).
2. Put it in `public/images/recipes/` (or `journal/`).
3. Add it to the content file:

```json
"image": { "src": "/images/recipes/homemade-lasagne.jpg", "alt": "A slice of lasagne lifted from the dish, béchamel bubbling" }
```

Use the same `image` field on categories, journal entries, `videos[].poster`, and `hero` / `about` in `site.json`. Shoot recipe heroes landscape (16:10 or wider). Card crops are portrait 4:5, so keep the food centred.

## Connecting services

These features are built and work, but need an account to deliver. Until they're configured, they tell the visitor so honestly rather than pretending.

| Feature | Service | Environment variables |
| --- | --- | --- |
| Contact form → your inbox | [Resend](https://resend.com) (free tier). Verify `breakingbread.co.uk` in Resend first. | `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` |
| Newsletter sign-ups | [Buttondown](https://buttondown.com) (free tier). Swap the fetch in `src/app/api/newsletter/route.ts` for Mailchimp, Kit etc. if preferred. | `BUTTONDOWN_API_KEY` |
| Canonical URLs / sitemap | — | `NEXT_PUBLIC_SITE_URL` (defaults to `https://breakingbread.co.uk`) |

See `.env.example`. Also update the TikTok and Instagram handles in `content/site.json`; they're currently set to `@breakingbread`.

## Deploying to breakingbread.co.uk (Vercel)

1. Push this repository to GitHub.
2. At [vercel.com/new](https://vercel.com/new), import the repo. Set **Root Directory** to `breaking-bread`. The framework is detected as Next.js automatically.
3. Under **Settings → Environment Variables**, add the variables above, then redeploy.
4. Under **Settings → Domains**, add `breakingbread.co.uk` and `www.breakingbread.co.uk` (Vercel will suggest redirecting one to the other).
5. At your domain registrar (where you bought the `.co.uk`), set the DNS records Vercel shows. Typically:
   - `A` record for `@` → `76.76.21.21`
   - `CNAME` record for `www` → `cname.vercel-dns.com`

   HTTPS is issued automatically once DNS propagates (minutes to a few hours).
6. In [Google Search Console](https://search.google.com/search-console), add the domain and submit `https://breakingbread.co.uk/sitemap.xml`. Test a recipe page with Google's [Rich Results Test](https://search.google.com/test/rich-results).

Any host that runs Node 18+ works too (`npm run build && npm start`), including Netlify and Cloudflare via their Next.js adapters.

## Brand assets

- `src/components/Logo.tsx`: the mark and wordmark. The mark is a round loaf with two scores that form a Latin cross: bread first, fellowship second.
- `public/brand/breaking-bread-avatar.svg`: square profile picture for TikTok and Instagram (bronze on charcoal).
- `public/brand/breaking-bread-mark.svg` / `-mark-cream.svg`: single-colour marks for overlaying on photos and for merchandise.

Type: **Cormorant Garamond** (headings) and **Karla** (body and navigation), self-hosted via `next/font`. Colours are defined as tokens in `src/app/globals.css`.

## What's where

```
content/            all words, recipes, links (edit these)
public/images/      your photographs
src/app/            pages, API routes, sitemap, robots, OG images
src/components/     reusable UI (RecipeCard, Photo, Header, SearchDialog…)
src/lib/            content loading, types, formatting, SEO helpers
```
