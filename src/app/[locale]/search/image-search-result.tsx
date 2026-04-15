'use client'

import { useSearchStore } from '@/lib/use-search-store'
import { Link } from '@/i18n/navigation'
import { formatArrayValue } from '@/lib/utils'
import { Card } from '@/components/ui/card'

export function ImageSearchResult() {
  const result = useSearchStore((s) => s.result) as Record<string, unknown>
  const col = useSearchStore((s) => s.col)
  const hits = (result.hits as Record<string, unknown[]>)?.hits || []
  const colClass = col === 1 ? 'grid-cols-1' : col === 2 ? 'grid-cols-2' : col === 3 ? 'grid-cols-3' : col === 4 ? 'grid-cols-4' : col === 6 ? 'grid-cols-6' : 'grid-cols-12'

  return (
    <div className={`grid ${colClass} gap-4`}>
      {hits.map((item: unknown, i: number) => {
        const obj = item as { _id: string; _source: Record<string, string[]> }
        return (
          <Card key={i} className="overflow-hidden">
            <Link href={`/item/${obj._id}`} className="no-underline">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formatArrayValue(obj._source._thumbnail)}
                alt={formatArrayValue(obj._source._label)}
                className="w-full h-48 object-contain bg-muted"
              />
            </Link>
          </Card>
        )
      })}
    </div>
  )
}
