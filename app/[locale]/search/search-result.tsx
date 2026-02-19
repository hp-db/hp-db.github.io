'use client'

import { useSearchStore } from '@/store/use-search-store'
import { HpdbSearchResult } from './hpdb-search-result'
import { GridSearchResult } from './grid-search-result'
import { ImageSearchResult } from './image-search-result'
import { TableSearchResult } from './table-search-result'
import { StatsSearchResult } from './stats-search-result'
import { ListSearchResult } from './list-search-result'

export function SearchResult() {
  const layout = useSearchStore((s) => s.layout)

  switch (layout) {
    case 'hpdb':
      return <HpdbSearchResult />
    case 'grid':
      return <GridSearchResult />
    case 'image':
      return <ImageSearchResult />
    case 'table':
      return <TableSearchResult />
    case 'stats':
      return <StatsSearchResult />
    case 'list':
      return <ListSearchResult />
    default:
      return <HpdbSearchResult />
  }
}
