'use client'

import { useState, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchStore } from '@/store/use-search-store'
import { getSearchQueryFromQueryStore } from '@/lib/search-utils'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export function CustomFacetOption({
  term,
  label,
  buckets,
}: {
  term: string
  label: string
  buckets: { key: string; doc_count: number }[]
}) {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const advanced = useSearchStore((s) => s.advanced)
  const facetOptions = useSearchStore((s) => s.facetOptions)

  const getArray = useCallback(
    (type: '+' | '-'): string[] => {
      const fcLabel = 'fc-' + term
      if (!advanced.fc || !advanced.fc[fcLabel]) return []
      return advanced.fc[fcLabel][type] || []
    },
    [advanced.fc, term]
  )

  const initialOpen = !!(
    facetOptions[term]?.open ||
    getArray('-').length > 0 ||
    getArray('+').length > 0
  )
  const [open, setOpen] = useState(initialOpen)

  const checkedValues = useMemo(() => {
    const checked: Record<string, boolean> = {}
    const fcLabel = 'fc-' + term
    for (const bucket of buckets) {
      const obj = advanced.fc[fcLabel]
      checked[bucket.key] = !!(obj && obj['+'].includes(bucket.key))
    }
    return checked
  }, [buckets, advanced.fc, term])

  const notExcluded = getArray('-')

  const message = useMemo(() => {
    const size = buckets.length
    let prefix = ''
    if (size === 50) {
      prefix = t('top_prefix')
    }
    return prefix + size.toLocaleString() + t('items_count_suffix')
  }, [buckets.length, t])

  if (buckets.length === 0 && notExcluded.length === 0) return null

  const handleChange = (key: string) => {
    const fcLabel = 'fc-' + term
    const obj = advanced.fc[fcLabel]
    if (obj && obj['+'].includes(key)) {
      useSearchStore.getState().removeAdvanced({
        label: fcLabel,
        values: [key],
        type: 'fc',
      })
    } else {
      useSearchStore.getState().setAdvanced({
        label: fcLabel,
        values: [key],
        type: 'fc',
      })
    }
    // updateQuery reads getState() — defer one tick so the store update lands first
    setTimeout(updateQuery, 0)
  }

  const handleExclude = (key: string) => {
    useSearchStore.getState().setAdvanced({
      label: 'fc-' + term,
      values: ['-' + key],
      type: 'fc',
    })
    updateQuery()
  }

  const handleRemoveExclude = (key: string) => {
    useSearchStore.getState().removeAdvanced({
      label: 'fc-' + term,
      values: ['-' + key],
      type: 'fc',
    })
    updateQuery()
  }

  const updateQuery = () => {
    const state = useSearchStore.getState()
    const query = getSearchQueryFromQueryStore(state, searchParams?.get('u') || undefined)
    query.from = '0'
    const params = new URLSearchParams()
    for (const [key, val] of Object.entries(query)) {
      if (Array.isArray(val)) val.forEach((v) => params.append(key, v))
      else params.append(key, val)
    }
    router.push(`/search?${params.toString()}`)
  }

  const displayLabel = label.startsWith('_') ? label.slice(1) : label

  return (
    <div className="mb-3 border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-muted px-3 py-2.5 text-left hover:bg-muted/80 transition-colors"
      >
        <span className="text-sm font-medium">
          {displayLabel} <span className="text-muted-foreground font-normal">({message})</span>
        </span>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div>
          <div className="max-h-96 overflow-y-auto">
            {buckets.map((bucket, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border/50 px-3 py-1.5">
                <label className={`flex items-center gap-2 cursor-pointer text-sm flex-1 ${term.includes('Phone/Word') ? 'phone' : ''}`}>
                  <Checkbox
                    checked={!!checkedValues[bucket.key]}
                    onCheckedChange={() => handleChange(bucket.key)}
                  />
                  {['Item Type', 'Sub Type', 'Unit'].includes(term)
                    ? t(bucket.key)
                    : bucket.key}
                </label>
                <span className="text-xs text-muted-foreground mx-2">
                  {bucket.doc_count.toLocaleString()}
                </span>
                {!checkedValues[bucket.key] && (
                  <button
                    onClick={() => handleExclude(bucket.key)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`${t('exclude')} ${bucket.key}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {notExcluded.map((key, i) => (
            <div
              key={`not-${i}`}
              className="flex items-center px-3 py-1.5 border-t cursor-pointer hover:bg-accent"
              onClick={() => handleRemoveExclude(key)}
            >
              <span className="text-destructive mr-2 text-sm font-bold">-</span>
              <span className="text-sm">{key}</span>
            </div>
          ))}

          <div className="px-3 py-2 border-t">
            <Button onClick={updateQuery} size="sm">
              {t('update')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
