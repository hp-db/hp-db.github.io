# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hieratische Paläographie DB (HPDB) — a retrieval system for hieratic scripts using IIIF format images from Georg Möller's *Hieratische Paläographie* (1909–36). Built as a bilingual (EN/JA) static site deployed to GitHub Pages.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19) with static export (`output: 'export'`)
- **UI**: Radix UI primitives + shadcn-style components, Tailwind CSS v4
- **Language**: TypeScript
- **State**: Zustand (`src/lib/use-search-store.ts`)
- **i18n**: next-intl with translations in `src/messages/en.json` and `src/messages/ja.json`; routing via `src/i18n/`
- **Themes**: `next-themes` (light/dark)

## Build & Development Commands

```bash
npm run dev     # Local dev server at localhost:3108 (Turbopack)
npm run build   # Production build (static export into out/)
npm run start   # Start a production server
npm run lint    # ESLint
npm run deploy  # Push out/ to gh-pages branch
```

No test framework is configured.

## Architecture

### Data Flow

1. **Search entry**: `src/app/[locale]/search/page.tsx` → `search-content.tsx` orchestrates the search UI
2. **Search form**: `src/app/[locale]/search/search-form.tsx` collects user input
3. **Query processing**: `src/lib/search-utils.ts` builds Elasticsearch-style queries and handles faceting/filtering — this is the core logic
4. **State**: Zustand store (`src/lib/use-search-store.ts`) manages keywords, advanced filters, pagination, layout, facets, and results
5. **Display**: `src/app/[locale]/search/result.tsx` dispatches to `hpdb-`, `grid-`, `list-`, `image-`, `table-`, or `stats-search-result.tsx` based on layout

### Key Directories

- `src/app/[locale]/` — Localized App Router routes (`/search`, `/item/[id]`, `/category/[id]`, `/property/[id]`, `/concordance`, `/datasets`, `/about`, `/manual`, `/vis`, etc.)
- `src/components/ui/` — shadcn-style Radix UI wrappers (button, card, dialog, dropdown-menu, ...)
- `src/components/common/` — Shared widgets (share-buttons, etc.)
- `src/lib/` — Business logic: `search-utils.ts`, `facet-options.ts`, `facet-utils.ts`, `concordance-utils.ts`, `use-search-store.ts`, `utils.ts`
- `src/i18n/` — next-intl config, routing, request handler
- `src/messages/` — `en.json` / `ja.json` translations
- `public/data/` — Application data (curation.json, IIIF manifests, index)
- `scripts/` — Python scripts for data processing (CSV→JSON, RDF/SHACL generation, IIIF manifest creation, image downloading)

### Static Export

`next.config.ts` sets `output: 'export'` with `trailingSlash: true`. All dynamic routes require `generateStaticParams()`:
- `/item/[id]` from the item dataset
- `/category/[id]` from `facetOptions` keys (slugified: `/` → `-`, space → `_`)
- `/property/[id]` from properties

### Search Query Syntax

- Full-text: `keyword=hieratic`
- Field-based: `Item:X-001`, `HieraticNo:123`
- URL faceted filters: `?fc-ItemType=glyph&fc-Unit=Vol1`
- Advanced include/exclude: `?q-HieraticNo=123` (include), `?q-HieraticNo=-123` (exclude)

## Conventions

- **Formatting**: No semicolons, single quotes, 2-space indents
- **Path alias**: `@/` maps to `src/`
- **Commits**: Conventional commit format enforced by commitlint
