'use client'

import { useSearchStore } from '@/lib/use-search-store'
import { Link } from '@/i18n/navigation'
import { formatArrayValue, truncate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function ListSearchResult() {
  const result = useSearchStore((s) => s.result) as Record<string, unknown>
  const hits = (result.hits as Record<string, unknown[]>)?.hits || []

  return (
    <div>
      {hits.map((item: unknown, i: number) => {
        const obj = item as { _id: string; _source: Record<string, string[]> }
        const source = obj._source
        return (
          <Card key={i} className="mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:w-1/4">
                  <Link href={`/item/${obj._id}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formatArrayValue(source._thumbnail)}
                      alt={formatArrayValue(source._label)}
                      className="w-full h-36 object-contain bg-muted rounded"
                    />
                  </Link>
                </div>
                <div className="sm:w-3/4">
                  <h3 className="mb-2">
                    <Link href={`/item/${obj._id}`}>
                      <span dangerouslySetInnerHTML={{ __html: formatArrayValue(source._label) }} />
                    </Link>
                  </h3>
                  {Object.entries(source).map(([field, values]) => {
                    if (field.startsWith('_')) return null
                    return (
                      <div key={field}>
                        <div className="flex py-1 text-sm">
                          <span className="w-1/4 text-muted-foreground">{field}</span>
                          <span className="w-3/4">
                            {values.map((v, j) => (
                              <span key={j} className="mr-4">
                                {truncate(v, 100)}
                              </span>
                            ))}
                          </span>
                        </div>
                        <Separator />
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
