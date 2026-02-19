'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Filter } from 'lucide-react'
import { splitForFacet } from '@/lib/facet-utils'

export function CustomSplit({ data, field }: { data: string[] | undefined; field: string }) {
  const t = useTranslations()

  if (!data || data.length === 0) return null
  const raw = data[0]
  const items = splitForFacet(raw)

  // Build elements array for display
  let display = raw
  const lens = [...new Set(items.map((i) => i.length))].sort((a, b) => b - a)
  for (const len of lens) {
    const lenItems = items.filter((i) => i.length === len)
    for (const item of lenItems) {
      display = display.split(item).join('$$$')
    }
  }
  const elements = display.split('$$$')

  return (
    <span className="inline-flex items-center gap-0.5 flex-wrap">
      {elements.map((el, i) => (
        <span key={i} className="inline-flex items-center">
          {el}
          {items[i] && (
            <>
              {items[i]}
              <Link
                href={{ pathname: '/search', query: { [`fc-${field}`]: items[i] } } as unknown as string}
                className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-muted hover:bg-accent transition-colors"
                title={t('filter_by_this')}
              >
                <Filter className="w-3 h-3" />
              </Link>
            </>
          )}
        </span>
      ))}
    </span>
  )
}
