'use client'

import { useSearchStore } from '@/lib/use-search-store'
import { CustomFacetOption } from './custom-facet-option'

export function FacetSearchOptions() {
  const result = useSearchStore((s) => s.result) as Record<string, unknown>
  const facetOptions = useSearchStore((s) => s.facetOptions)
  const aggregations = (result.aggregations || {}) as Record<
    string,
    { buckets: { key: string; doc_count: number }[] }
  >

  return (
    <div>
      {Object.entries(facetOptions).map(([key, opt]) => {
        const agg = aggregations[key]
        if (!agg) return null
        return (
          <CustomFacetOption
            key={key}
            term={key}
            label={opt.label}
            buckets={agg.buckets}
          />
        )
      })}
    </div>
  )
}
