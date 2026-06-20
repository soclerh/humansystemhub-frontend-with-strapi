# Human Systems (Socle RH) — Codebase Map
_Last updated: 2026-06-20_

## Identity
Marketing/content website for **Human Systems / Socle RH**, an "all-in-one HR SaaS
platform". This repo is the **Next.js frontend only** — all content (pages, blogs,
modules, resources, header/footer, pricing) is fetched from a **Strapi CMS** backend.
Multilingual (en / fr / ar). No app/auth/dashboard here — purely the public site.

- Languages: TypeScript + React. Framework: **Next.js 16.1.6** (App Router), **React 19.2.3**.
- Styling: **Tailwind CSS v4** + `@tailwindcss/typography`. Animations: `framer-motion`.
- Icons: `lucide-react` + `react-icons`. Markdown: `react-markdown`. Query strings: `qs`.
- Min runtime: Node 20 (Docker base `node:20-alpine`, `@types/node ^20`).

> ⚠️ Non-standard Next.js 16 — APIs/conventions may differ from training data.
> When writing Next-specific code, verify against `node_modules/next/dist/docs/`.

## Stack & build
- **Package manager:** ambiguous — both `bun.lock` and `package-lock.json` are committed.
  Local dev has used Bun (sibling project convention); **Docker builds use npm (`npm ci`)**.
  Pick one and keep both lockfiles in sync, or you'll get drift. (See Gotchas.)
- **Build tool:** Next.js default. React Compiler is **not** enabled here.
- **Lint/format:** Biome 2.2.0 (not ESLint/Prettier).
- **Backend dependency:** a running Strapi instance at `NEXT_PUBLIC_STRAPI_URL`.
  Prod points at `https://human-systems-490110.uc.r.appspot.com/` (hardcoded in Dockerfile).
  Local default fallback: `http://localhost:1337`.

## Commands
| Action | Command |
|---|---|
| Run dev | `npm run dev` (or `bun run dev`) — `next dev` |
| Run all tests | _none — no test suite_ |
| Run one test | _n/a_ |
| Lint | `npm run lint` (`biome check`) |
| Typecheck | `npx tsc --noEmit` (no dedicated script) |
| Format | `npm run format` (`biome format --write`) |
| Build | `npm run build` (`next build`) |
| Start (prod) | `npm start` (`next start`) |
| Docker build | `docker build -t human-system .` (multi-stage, runs on PORT 8080) |

## Bootstrap flow
1. `src/middleware.ts` runs first on every non-static request. It detects/injects the
   locale: if the path lacks a known locale (`en`/`fr`/`ar`) it **redirects** to
   `/{locale}/...` (locale from `NEXT_LOCALE` cookie, else `en`); if present it syncs the cookie.
2. `src/app/[lang]/layout.tsx` (`RootLayout`, async) — loads Sora + DM Sans fonts, sets
   `<html lang dir>` (rtl for `ar`), **fetches global header/footer from Strapi**
   (`getGlobalData`), and renders `<Header>` + page + `<Footer>`.
3. Each `src/app/[lang]/**/page.tsx` is an **async Server Component** that calls a loader
   from `src/data/loader.ts`, finds the Strapi block(s) by `__component`, and renders
   section components from `src/components/`.

## Directory layout
- `src/app/[lang]/` — App Router pages, all under a `[lang]` dynamic segment. `globals.css` is in `src/app/`.
- `src/components/` — section components grouped by page: `homepage/`, `about/`, `modules/`, `pricing/`, `contact/`, `blog/`, `resources/`, plus `layouts/Header.tsx` and `shared/`.
- `src/data/` — **`loader.ts`** (all Strapi fetchers + `qs` populate queries) and static fallback/legacy data (`modules.ts`, `staticPricing.ts`, `resources.ts`, `blogs.ts`).
- `src/utils/` — `fetch-api.ts` (generic `fetchAPI` wrapper) and `get-strapi-url.ts`.
- `src/lib/utils.ts` — `cn()` (clsx+tailwind-merge) and `getStrapiMedia()` URL helper.
- `src/middleware.ts` — locale routing.
- `public/` — images, logos, favicons, SVGs.

## Surfaces
**Auth: none.** Every page is public, statically/dynamically rendered from public Strapi
APIs. There are **no API routes or route handlers** in this repo. The only outbound
write is the contact form → an external Google Apps Script.

| Name | Type | File:Line | Auth/Cap | Purpose |
|---|---|---|---|---|
| `middleware` | Edge middleware | `src/middleware.ts:7` | public | Locale detect/redirect + `NEXT_LOCALE` cookie sync; matcher excludes `_next`, `api`, files with a dot |
| `RootLayout` | Layout (async) | `src/app/[lang]/layout.tsx:27` | public | Fonts, `<html lang dir>`, fetches global header/footer from Strapi |
| `/[lang]` | Page | `src/app/[lang]/page.tsx:13` | public | Homepage; renders Strapi `home.*` blocks + static pricing fallback |
| `/[lang]/about` | Page | `src/app/[lang]/about/page.tsx:9` | public | `getPageData("about")` → about.* blocks |
| `/[lang]/contact` | Page | `src/app/[lang]/contact/page.tsx:12` | public | Contact page + form (see Contact form below) |
| `/[lang]/get-started` | Page | `src/app/[lang]/get-started/page.tsx:9` | public | Trial-registration form; navbar "Get Started" CTA target |
| Trial register submit | Client `fetch` (external) | `src/components/get-started/RegisterTrialForm.tsx` | public, no auth | POSTs JSON to `app.humansystemhub.com/api/v1/register-trial`; timezone list fetched from `timeapi.io` |
| `/[lang]/pricing` | Page | `src/app/[lang]/pricing/page.tsx:15` | public | `getPageData("pricing")` + static pricing fallback |
| `/[lang]/modules` | Page | `src/app/[lang]/modules/page.tsx:12` | public | `getPageData("modules")` module grid |
| `/[lang]/modules/[slug]` | Page (SSG) | `src/app/[lang]/modules/[slug]/page.tsx:39` | public | Module detail; `generateStaticParams` + `generateMetadata` from Strapi |
| `/[lang]/blog` | Page | `src/app/[lang]/blog/page.tsx:15` | public | Blog listing; featured + grid |
| `/[lang]/blog/[slug]` | Page (SSG) | `src/app/[lang]/blog/[slug]/page.tsx:18` | public | Blog detail; `generateStaticParams`; markdown body |
| `/[lang]/resources/hr-toolkit` | Page | `src/app/[lang]/resources/hr-toolkit/page.tsx:11` | public | HR toolkit listing |
| `/[lang]/resources/hr-toolkit/[slug]` | Page (dynamic) | `src/app/[lang]/resources/hr-toolkit/[slug]/page.tsx:7` | public | Toolkit detail; **no** `generateStaticParams` |
| `/[lang]/resources/compliance` | Page | `src/app/[lang]/resources/compliance/page.tsx:11` | public | Compliance listing |
| `/[lang]/resources/compliance/[slug]` | Page (dynamic) | `src/app/[lang]/resources/compliance/[slug]/page.tsx:7` | public | Compliance detail; **no** `generateStaticParams` |
| `/[lang]/resources/use-cases` | Page | `src/app/[lang]/resources/use-cases/page.tsx:11` | public | Use-cases listing |
| `/[lang]/resources/use-cases/[slug]` | Page (dynamic) | `src/app/[lang]/resources/use-cases/[slug]/page.tsx:7` | public | Use-case detail; **no** `generateStaticParams` |
| Contact form submit | Client `fetch` (external) | `src/components/contact/ContactForm.tsx:114` | public, no auth | POSTs form-encoded data to a hardcoded **Google Apps Script** URL (`:7`) |

Note: `src/app/[lang]/resources/` has **no `page.tsx`** (no `/resources` index) — only the three sub-sections.

## Data
- **Source of truth: Strapi CMS** over REST. All fetchers live in `src/data/loader.ts`,
  each building a `qs`-stringified `populate` query and calling `fetchAPI`.
  Content types consumed: `homepage`, `global` (header/footer), `pages` (about/contact/
  modules/pricing via a universal `blocks` query keyed by `__component`), `modules`,
  `blogs`, `hr-toolkits`, `compliances`, `use-cases`.
- **Locale** is threaded through every query (`locale` param) from the `[lang]` route segment.
- **Caching:** every fetch is tagged (`next: { tags: [...] }`, always including `"strapi-data"`),
  enabling on-demand revalidation. No `revalidate` interval set.
- **Response-shape defensiveness:** pages handle both Strapi v4 (`.attributes`) and
  flattened (`.data` / `.data[0]`) shapes, e.g. `item.attributes || item`. Keep this pattern.
- **Static fallback / legacy data in `src/data/`:**
  - `staticPricing.ts` — **active** fallback for the pricing UI when Strapi has none.
  - `modules.ts` — **active**: exports `modules` array (used by `ModuleNavigation`/`ModuleDetailCta`
    for prev/next) and the `Module` type (imported across `components/modules/`).
  - `resources.ts` — exports the `ResourceItem` type used by `ResourceCard`.
  - `blogs.ts` — **appears unused** (no imports found); likely legacy. Verify before relying on it.

## Assets
- Theme/fonts in `src/app/globals.css` via Tailwind v4 (`@import "tailwindcss"`; `@plugin` typography).
  Body background is brand dark green `#013228`; brand accent `#E3FFCD`. Fonts: Sora (headings),
  DM Sans (body) via `next/font/google`.
- `next.config.ts` `images.remotePatterns` allow: `images.unsplash.com`, `media.licdn.com`,
  and localhost:1337 / 127.0.0.1:1337 `/uploads/**` (Strapi media). **Strapi prod host is NOT
  in remotePatterns** — prod Strapi images are rendered with `unoptimized` / plain `<img>` in places.
- `getStrapiMedia()` (`src/lib/utils.ts`) prefixes relative Strapi media URLs with the base URL.
- Lots of `globals.css` rules exist to hide the Google Translate widget banner.

## External services
- **Strapi CMS** — `NEXT_PUBLIC_STRAPI_URL` (`src/utils/get-strapi-url.ts`). Public reads,
  no auth token sent (`fetchAPI` supports `authToken` but loaders never pass one). Prod:
  `https://human-systems-490110.uc.r.appspot.com/` (Google App Engine).
- **Google Apps Script** — contact form POST target, hardcoded in
  `src/components/contact/ContactForm.tsx:7`. No auth, no server-side validation/spam protection.
- **Deploy:** multi-stage `Dockerfile` → Google Cloud Run (listens on `PORT=8080`, runs `npm start`).
  `NEXT_PUBLIC_STRAPI_URL` and `NEXT_TELEMETRY_DISABLED` are hardcoded into the Dockerfile.

## Conventions
- Path alias `@/*` → `src/*` (`tsconfig.json`).
- Locale is always the first route segment; pages read it via `const { lang } = await params`
  (`params` is a Promise in Next 16). Always **prefix internal `Link` hrefs with `/${lang}`**.
- Strapi blocks are selected by `__component` string (e.g. `"home.hero-section"`); each page
  `.find()`s the blocks it needs and passes them as `data` props to section components.
- Section components take loosely-typed `data?: any` props and render defensively (fallback copy).
- Server Components by default; `"use client"` only where interactivity is needed
  (Header, LanguageSwitcher, ContactForm, PageLoader, FAQ/Pricing/Testimonials accordions, etc.).
- i18n strings are sometimes hardcoded per-component (e.g. `ContactForm` has its own en/fr `translations` map) rather than centralized.
- Biome: 2-space indent; React/Next domains enabled.

## Where to add a thing
- **New page/route** → `src/app/[lang]/<route>/page.tsx` as an async Server Component;
  add a loader in `src/data/loader.ts` if it needs Strapi data.
- **New Strapi-driven section** → add the block to the relevant `qs` populate query in
  `loader.ts`, then `.find(b => b.__component === "...")` in the page and pass to a new
  component under the matching `src/components/<area>/` folder.
- **New dynamic detail route** → add `generateStaticParams` (see blog/modules for the pattern)
  if you want SSG; resource detail pages currently omit it (fully dynamic).
- **New locale** → add to `locales` in `src/middleware.ts` AND the `languages` array in
  `src/components/shared/LanguageSwitcher.tsx` (note `ar` is in middleware but commented out in the switcher).
- **New allowed image host** → add to `images.remotePatterns` in `next.config.ts`.

## Risks & gotchas
- **Deploy target is case-sensitive Linux** (alpine/Cloud Run) but local dev is Windows.
  Keep all import paths and filenames **case-exact** (this bit the sibling `ca-pravin-jain` project).
- **Two lockfiles** (`bun.lock` + `package-lock.json`). Docker uses `npm ci`; local may use Bun.
  They can drift — decide on one package manager and keep lockfiles consistent.
- **`NEXT_PUBLIC_STRAPI_URL` is hardcoded in the Dockerfile** and baked in at build time.
  Changing backend host = rebuild image; can't override at runtime for client bundles.
- **Strapi prod host missing from `images.remotePatterns`** — `next/image` from prod Strapi would
  throw unless `unoptimized`/`<img>` is used. Add the host if you want optimized Strapi images.
- **Back-link bug:** `resources/hr-toolkit/[slug]/page.tsx` (and likely other resource detail
  pages) link `href="/resources/hr-toolkit"` **without** the `/${lang}` prefix. Middleware will
  redirect but the chosen locale is lost. Prefix with `/${lang}`.
- **Contact form has no auth/spam protection** and posts to a public Google Apps Script; the URL
  is committed in source. Treat as low-trust; consider rate limiting / captcha.
- **No tests, no typecheck script, no CI config in repo.** Verify with `npx tsc --noEmit` + `biome check` manually.
- `.env` is gitignored but a copy exists locally with `NEXT_PUBLIC_STRAPI_URL`.
- Non-standard Next 16 — don't assume training-data APIs.
- **`middleware` file convention is deprecated** in this Next 16 (build warns: "Please use
  `proxy` instead"). `src/middleware.ts` still works and is what drives locale routing today;
  migrate to a `proxy` file if/when you touch it.

## Open questions
- Package manager: **Bun or npm**? Should one lockfile be removed?
- Is `src/data/blogs.ts` dead code (safe to delete) or intended fallback?
- Is the `ar` (Arabic/RTL) locale meant to be live? It's wired in middleware/layout but
  commented out in the language switcher.
- Where should the contact form actually submit long-term (Strapi endpoint vs Apps Script)?
- Is the Strapi backend itself in a separate repo, and is there a staging URL for local dev?
