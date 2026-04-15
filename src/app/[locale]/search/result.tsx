'use client'

import { useTranslations } from 'next-intl'
import { useSearchStore } from '@/lib/use-search-store'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Pagination } from './pagination'
import { SearchResult } from './search-result'
import { FacetSearchOptions } from './facet-search-options'

export function Result() {
  const t = useTranslations()
  const result = useSearchStore((s) => s.result) as Record<string, unknown>
  const facetFlag = useSearchStore((s) => s.facetFlag)
  const setFacetFlag = useSearchStore((s) => s.setFacetFlag)

  const total = (result.hits as Record<string, unknown>)
    ? ((result.hits as Record<string, Record<string, number>>).total?.value || 0)
    : 0

  if (total === 0) return null

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Facets sidebar */}
      <div className={`${facetFlag ? 'sm:w-1/4' : ''} order-2 sm:order-1`}>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFacetFlag(!facetFlag)}
            title={facetFlag ? t('close_facets') : t('open_facets')}
            aria-label={facetFlag ? t('close_facets') : t('open_facets')}
            className="h-8 w-8"
          >
            {facetFlag ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </Button>
          {t('refine_your_search')}
        </h3>
        {facetFlag && <FacetSearchOptions />}
      </div>

      {/* Main results */}
      <div className={`${facetFlag ? 'sm:w-3/4' : 'w-full'} order-1 sm:order-2`}>
        <div className="flex justify-center my-4">
          <Pagination />
        </div>
        <SearchResult />
        <div className="flex justify-center my-4">
          <Pagination />
        </div>
      </div>
    </div>
  )
}
