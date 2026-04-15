'use client'

import { useTranslations } from 'next-intl'
import { useSearchStore } from '@/lib/use-search-store'
import { getSearchQueryFromQueryStore } from '@/lib/search-utils'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { X, MinusSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function CustomFilter() {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const keyword = useSearchStore((s) => s.keyword)
  const advanced = useSearchStore((s) => s.advanced)

  const hasFilters =
    keyword.length > 0 ||
    Object.keys(advanced.fc).length > 0 ||
    Object.keys(advanced.q).length > 0

  if (!hasFilters) return null

  const removeKey = (value: string) => {
    useSearchStore.getState().removeKey({ label: 'keyword', value: [value] })
    const state = useSearchStore.getState()
    const query = getSearchQueryFromQueryStore(state, searchParams?.get('u') || undefined)
    const params = new URLSearchParams()
    for (const [key, val] of Object.entries(query)) {
      if (Array.isArray(val)) val.forEach((v) => params.append(key, v))
      else params.append(key, val)
    }
    router.push(`/search?${params.toString()}`)
  }

  const removeAdvanced = (label: string, values: string[], type: string) => {
    useSearchStore.getState().removeAdvanced({ label, values, type })
    const state = useSearchStore.getState()
    const query = getSearchQueryFromQueryStore(state, searchParams?.get('u') || undefined)
    const params = new URLSearchParams()
    for (const [key, val] of Object.entries(query)) {
      if (Array.isArray(val)) val.forEach((v) => params.append(key, v))
      else params.append(key, val)
    }
    router.push(`/search?${params.toString()}`)
  }

  const getLabel = (term: string): string => {
    const types: Record<string, string> = {
      'fc-': t('facet'),
      'q-': t('advanced'),
    }
    for (const [prefix, typeLabel] of Object.entries(types)) {
      if (term.startsWith(prefix)) {
        const label = term.replace(prefix, '')
        return `[${typeLabel}] ${t(label)}`
      }
    }
    return term
  }

  return (
    <div className="bg-muted">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center flex-wrap">
        <span className="font-bold mr-2 text-sm">{t('search_query')}</span>

        {keyword.map((value, i) => (
          <Badge
            key={`kw-${i}`}
            className="m-1 gap-1"
          >
            {t('keyword')}: {value}
            <button onClick={() => removeKey(value)} className="ml-0.5 hover:opacity-80" aria-label={`${t('remove')} ${value}`}>
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}

        {(['fc', 'q'] as const).map((type) =>
          Object.entries(advanced[type]).map(([label, agg]) =>
            (['+', '-'] as const).map((method) =>
              agg[method].map((value, m) => (
                <Badge
                  key={`${type}-${label}-${method}-${m}`}
                  variant={method === '+' ? 'default' : 'destructive'}
                  className="m-1 gap-1"
                >
                  {method !== '+' && <MinusSquare className="w-3 h-3" />}
                  {getLabel(label)}:
                  <span className={label.includes('fc-Phone/Word') ? 'phone' : ''}>
                    {value}
                  </span>
                  <button
                    onClick={() =>
                      removeAdvanced(label, [method === '+' ? value : '-' + value], type)
                    }
                    className="ml-0.5 hover:opacity-80"
                    aria-label={`${t('remove')} ${value}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))
            )
          )
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const u = searchParams?.get('u')
            const params = u ? `?u=${u}` : ''
            router.push(`/search${params}`)
          }}
          className="text-destructive hover:text-destructive ml-1"
        >
          <X className="w-4 h-4 mr-1" /> {t('clear')}
        </Button>
      </div>
    </div>
  )
}
