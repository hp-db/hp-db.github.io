'use client'

import { useSearchStore } from '@/lib/use-search-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart } from './bar-chart'

export function StatsSearchResult() {
  const result = useSearchStore((s) => s.result) as Record<string, unknown>
  const facetOptions = useSearchStore((s) => s.facetOptions)
  const aggregations = (result.aggregations || {}) as Record<string, { buckets: { key: string; doc_count: number }[] }>

  return (
    <div>
      {Object.entries(facetOptions).map(([key, opt]) => {
        const agg = aggregations[key]
        if (!agg || !agg.buckets || agg.buckets.length === 0) return null
        return (
          <Card key={key} className="mb-10">
            <CardHeader>
              <CardTitle className="text-lg">{opt.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart buckets={agg.buckets} height={200} />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
