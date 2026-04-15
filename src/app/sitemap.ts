export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'
import * as fs from 'node:fs'
import * as path from 'node:path'

const BASE_URL = 'https://moeller.jinsha.tsukuba.ac.jp'
const locales = ['en', 'ja'] as const

type SitemapEntry = MetadataRoute.Sitemap[number]

function urlFor(locale: string, pathSegment: string): string {
  return `${BASE_URL}/${locale}${pathSegment}`
}

function staticEntries(): MetadataRoute.Sitemap {
  const pages: {
    path: string
    priority: number
    changeFrequency: SitemapEntry['changeFrequency']
  }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'monthly' },
    { path: '/search/', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/concordance/', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/datasets/', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/api/', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/about/', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/about/changelog/', priority: 0.4, changeFrequency: 'monthly' },
    { path: '/about/concordance-sources/', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/manual/search/', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/manual/ga/', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/category/Vol/', priority: 0.7, changeFrequency: 'monthly' },
  ]

  return pages.flatMap(({ path: p, priority, changeFrequency }) =>
    locales.map((locale) => ({
      url: urlFor(locale, p),
      priority,
      changeFrequency,
    }))
  )
}

function itemEntries(): MetadataRoute.Sitemap {
  const indexPath = path.join(process.cwd(), 'public', 'data', 'index.json')
  const raw = fs.readFileSync(indexPath, 'utf-8')
  const items = JSON.parse(raw) as Array<{ _id: string | number }>

  return items.flatMap((item) =>
    locales.map((locale) => ({
      url: urlFor(locale, `/item/${item._id}/`),
      priority: 0.5,
      changeFrequency: 'yearly' as SitemapEntry['changeFrequency'],
    }))
  )
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticEntries(), ...itemEntries()]
}
