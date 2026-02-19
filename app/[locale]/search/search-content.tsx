'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useSearchStore } from '@/store/use-search-store'
import { loadIndex, initStore, createQuery, search } from '@/lib/search-utils'
import { facetOptions } from '@/lib/facet-options'
import { SearchForm } from './search-form'
import { CustomFilter } from './custom-filter'
import { ResultHead } from './result-head'
import { Result } from './result'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

function SearchPageInner() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const tRef = useRef(t)
  tRef.current = t

  const sortOptions = [
    { value: 'm_sort:asc', text: t('Hieratic No') + ' ' + t('asc') },
    { value: 'm_sort:desc', text: t('Hieratic No') + ' ' + t('desc') },
    { value: 'h_sort:asc', text: t('Hieroglyph No') + ' ' + t('asc') },
    { value: 'h_sort:desc', text: t('Hieroglyph No') + ' ' + t('desc') },
    { value: 'vol:asc', text: t('Vol') + ' ' + t('asc') },
    { value: 'vol:desc', text: t('Vol') + ' ' + t('desc') },
  ]

  const layoutOptions = [
    { value: 'hpdb', text: 'default' },
    { value: 'grid', text: 'grid' },
    { value: 'image', text: 'thumbnail' },
    { value: 'table', text: 'table' },
    { value: 'stats', text: 'graph' },
  ]

  useEffect(() => {
    const doSearch = async () => {
      setLoading(true)
      const routeQuery: Record<string, string | string[]> = {}
      searchParams?.forEach((value, key) => {
        const existing = routeQuery[key]
        if (existing) {
          if (Array.isArray(existing)) {
            existing.push(value)
          } else {
            routeQuery[key] = [existing, value]
          }
        } else {
          routeQuery[key] = value
        }
      })

      if (!routeQuery.sort) routeQuery.sort = 'm_sort:asc'
      if (!routeQuery.layout) routeQuery.layout = 'hpdb'

      useSearchStore.getState().init(routeQuery)

      if (useSearchStore.getState().index == null) {
        const indexData = await loadIndex(BASE_URL + '/data/index.json')
        initStore(useSearchStore.getState(), indexData)
      }

      const tr = tRef.current
      const translatedFacetOptions: Record<string, { label: string; open: boolean; orderKey?: string; orderValue?: string; size?: number }> = {}
      for (const key in facetOptions) {
        translatedFacetOptions[key] = {
          ...facetOptions[key],
          label: tr(facetOptions[key].label),
        }
      }
      useSearchStore.getState().setFacetOptions(translatedFacetOptions)

      const state = useSearchStore.getState()
      const esQuery = createQuery(routeQuery, state)
      const result = search(
        state.index as Record<string, Record<string, number[]>>,
        state.data,
        esQuery
      )
      useSearchStore.getState().setResult(result)

      setLoading(false)
    }

    doSearch()
  }, [searchParams])

  return (
    <div>
      <SearchForm />
      <CustomFilter />
      <div className="max-w-7xl mx-auto px-4" style={{ minHeight: '60vh' }}>
        {loading ? (
          <div className="flex justify-center my-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            <ResultHead sortOptions={sortOptions} layoutOptions={layoutOptions} />
            <Result />
          </>
        )}
      </div>
    </div>
  )
}

export function SearchContent() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  )
}
