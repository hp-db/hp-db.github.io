# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hieratische Paläographie DB (HPDB) — a retrieval system for hieratic scripts using IIIF format images from Georg Möller's *Hieratische Paläographie* (1909–36). Built as a bilingual (EN/JA) static site deployed to GitHub Pages.

## Tech Stack

- **Framework**: Nuxt.js 2 (Vue 2) with static site generation (`target: 'static'`)
- **UI**: Vuetify (Material Design)
- **Language**: TypeScript with class-based Vue components (`nuxt-property-decorator`)
- **State**: Vuex (`store/index.js`)
- **i18n**: nuxt-i18n with translations in `lang/en.json` and `lang/ja.json`
- **Styling**: SCSS with Vuetify variables (`assets/variables.scss`)

## Build & Development Commands

```bash
npm run dev              # Local dev server at localhost:3000
npm run build:gh-pages   # Production build for GitHub Pages
npm run generate:gh-pages # Static site generation for GitHub Pages
npm run deploy           # Push dist/ to gh-pages branch
```

There is no test framework configured. Linting is available via ESLint:

```bash
# ESLint: @nuxtjs/eslint-config-typescript + Prettier
```

## Architecture

### Data Flow

1. **Search entry**: `pages/search.vue` orchestrates the search UI
2. **Search form**: `components/custom/SearchForm.vue` collects user input
3. **Query processing**: `plugins/searchUtils.ts` (~1100 lines) builds Elasticsearch-style queries, handles faceting/filtering — this is the core logic
4. **State**: Vuex store manages keywords, advanced filters, pagination, layout, facets, and results
5. **Display**: `components/search/Result.vue` renders results in grid/table/list/image layouts

### Key Directories

- `components/search/` — Reusable search UI (facets, filters, pagination, result layouts)
- `components/custom/` — HPDB-specific components (search form, custom filters, results)
- `components/display/` — Item display with IIIF/Mirador viewer
- `common/` — Shared widgets (Breadcrumbs, ShareButtons, Map, TOC)
- `pages/` — Routes: `/search`, `/item/:id`, `/category/:id`, `/property/:id`, `/about`, `/vis/`
- `env/` — Environment config (`production.ts` sets API base URL to moeller.jinsha.tsukuba.ac.jp)
- `src/` — Python scripts for data processing (CSV→JSON, RDF/SHACL generation, IIIF manifest creation, image downloading)
- `static/data/` — Application data including `curation.json` and IIIF manifests

### Static Route Generation

`nuxt.config.js` contains a `routes2()` function that reads `curation_old.json` to generate all `/item/:id` and `/ja/item/:id` routes, plus `/property/:id` routes for Item, HieroglyphNo, HieraticNo.

### Search Query Syntax

The search system supports structured queries:
- Full-text: `"hieratic"`
- Field-based: `Item:X-001`, `HieraticNo:123`
- URL faceted filters: `?fc-ItemType=glyph&fc-Unit=Vol1`
- Advanced include/exclude: `?q-HieraticNo=123` (include), `?q-HieraticNo=-123` (exclude)

## Conventions

- **Formatting**: No semicolons, single quotes (`.prettierrc`), 2-space indents
- **Components**: PascalCase names, class-based with `@Component` / `@Watch` decorators
- **Path aliases**: `~/` and `@/` both map to project root
- **Commits**: Conventional commit format enforced by commitlint
