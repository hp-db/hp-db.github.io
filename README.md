# Hieratische Paläographie DB

[![Deploy to GitHub Pages](https://github.com/hp-db/hp-db.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/hp-db/hp-db.github.io/actions/workflows/deploy.yml)

A bilingual (EN/JA) retrieval system for hieratic scripts, built on the IIIF-format images of Georg Möller's *Hieratische Paläographie* (1909–36) held by the Asian Research Library, The University of Tokyo.

Live site: <https://moeller.jinsha.tsukuba.ac.jp>

## Tech Stack

- Next.js 16 (App Router, React 19) with static export
- Tailwind CSS v4 + Radix UI (shadcn-style components)
- TypeScript, Zustand, next-intl, next-themes

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3108 (Turbopack)
```

## Build & Deploy

```bash
npm run build      # static export into out/
npm run lint
npm run deploy     # push out/ to gh-pages branch
```

The production site is deployed automatically by `.github/workflows/deploy.yml` on pushes to `master`.

## Project Layout

- `src/app/[locale]/` — localized App Router pages (search, item, category, concordance, datasets, about, manual, vis, …)
- `src/components/ui/` — Radix UI wrappers
- `src/lib/` — search/facet logic, Zustand store, utilities
- `src/i18n/` — next-intl routing & request config
- `src/messages/` — `en.json` / `ja.json` translations
- `public/data/` — application data (`curation.json`, IIIF manifests, search index)
- `scripts/` — Python data-processing scripts (CSV → JSON/RDF, IIIF manifests)

See [`CLAUDE.md`](./CLAUDE.md) for a more detailed architectural overview.
