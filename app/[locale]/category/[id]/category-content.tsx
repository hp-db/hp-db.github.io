'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useParams } from 'next/navigation'
import { useSearchStore } from '@/store/use-search-store'
import { loadIndex, initStore, createQuery, search } from '@/lib/search-utils'
import { facetOptions as defaultFacetOptions } from '@/lib/facet-options'
import { BarChart } from '../../search/bar-chart'
import { PieChart } from '../pie-chart'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export function CategoryContent() {
  const t = useTranslations()
  const locale = useLocale()
  const routeParams = useParams()
  const id = decodeURIComponent((routeParams?.id as string) || '').replace('-', '/')
  const [results, setResults] = useState<{ key: string; doc_count: number }[]>([])

  const facetOpts = useMemo(() => {
    const opts: Record<string, { label: string; open: boolean; orderKey?: string; orderValue?: string; size?: number }> = {}
    for (const [key, val] of Object.entries(defaultFacetOptions)) {
      opts[key] = { ...val, label: t(val.label) }
    }
    return opts
  }, [t])

  const title = useMemo(() => {
    if (facetOpts[id]) {
      return facetOpts[id].label
    }
    return id
  }, [facetOpts, id])

  const doSearch = useCallback(async () => {
    const store = useSearchStore.getState()

    if (store.index == null) {
      const indexData = await loadIndex(`${BASE_URL}/data/index.json`)
      initStore(useSearchStore.getState(), indexData)
    }

    useSearchStore.getState().setFacetOptions(facetOpts)

    const state = useSearchStore.getState()
    const esQuery = createQuery({}, { facetOptions: state.facetOptions, size: state.size }, false)
    const result = search(state.index!, state.data, esQuery)

    const aggs = result.aggregations as Record<string, { buckets: { key: string; doc_count: number }[] }>
    if (aggs[id]) {
      setResults(aggs[id].buckets)
    }
  }, [facetOpts, id])

  useEffect(() => {
    doSearch()
  }, [doSearch])

  return (
    <div className="max-w-4xl mx-auto px-4 my-8">
      <h1 className="text-2xl font-bold mb-6">
        {locale === 'ja' ? (
          <>{title}を一覧する</>
        ) : (
          <>{t('browse_by')} {title}</>
        )}
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(facetOpts).map(([key, opt]) => (
          <Link
            key={key}
            href={`/category/${key.replace('/', '-')}`}
            className="text-sm px-2 py-1 hover:bg-accent rounded-md transition-colors"
          >
            {opt.label.startsWith('_') ? t(opt.label) : opt.label}
          </Link>
        ))}
      </div>

      <Card className="mb-5">
        <CardContent className="p-3">
          <span className="font-bold text-sm">
            {results.length.toLocaleString()}{t('hits')}
          </span>
        </CardContent>
      </Card>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">{t('list')}</TabsTrigger>
          <TabsTrigger value="graph">{t('graph')}</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
            {results.map((obj, i) => (
              <div key={i} className="break-words">
                <Link
                  href={`/search?fc-${id}=${encodeURIComponent(obj.key)}`}
                  className={`mr-2 ${id.includes('Phone/Word') ? 'phone' : ''}`}
                >
                  {['Item Type', 'Sub Type', 'Unit'].includes(id) ? t(obj.key) : obj.key}
                </Link>
                <span className="text-muted-foreground text-sm">({Number(obj.doc_count).toLocaleString()})</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="graph">
          <div className="mb-10">
            <BarChart buckets={results} height={200} />
          </div>
          <div>
            <PieChart buckets={results} height={400} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
