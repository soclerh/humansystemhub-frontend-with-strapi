# Human Systems (Socle RH) frontend

Next.js 16 + React 19 marketing site. All content comes from a **Strapi CMS** backend;
this repo is the frontend only. Multilingual (en / fr / ar).

## Codebase map
See [.claude/CODEBASE_MAP.md](.claude/CODEBASE_MAP.md) for the full map (surfaces,
data flow, commands, layout, gotchas). Read it before exploring — it should save a re-scan.

## Hard rules
- **Next.js 16 is non-standard.** Verify Next-specific APIs against
  `node_modules/next/dist/docs/` before writing; they may differ from training data.
  `params` is a Promise — `const { lang } = await params`.
- **Tooling is Biome**, not ESLint/Prettier — `npm run lint` / `npm run format`.
  There is no test runner and no typecheck script; verify with `npx tsc --noEmit` + `biome check`.
- **Content is Strapi-driven.** Add/extend data via fetchers in `src/data/loader.ts`
  (build `qs` populate queries), select blocks by `__component`, render defensively
  (handle both `item.attributes` and flattened shapes).
- **Always prefix internal `Link` hrefs with `/${lang}`** — locale is the first route segment.
- **Keep import paths and filenames case-exact.** Deploy target is case-sensitive Linux
  (alpine/Cloud Run) even though local dev is Windows.
- **Two lockfiles exist** (`bun.lock` + `package-lock.json`); Docker uses `npm ci`. Don't let
  them drift — match whatever package manager you install with.
