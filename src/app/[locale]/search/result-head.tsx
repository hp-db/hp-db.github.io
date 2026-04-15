'use client'

import { useTranslations } from 'next-intl'
import { useSearchStore } from '@/lib/use-search-store'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ResultHead({
  sortOptions,
  layoutOptions,
}: {
  sortOptions: { value: string; text: string }[]
  layoutOptions: { value: string; text: string }[]
}) {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const result = useSearchStore((s) => s.result) as Record<string, unknown>
  const layout = useSearchStore((s) => s.layout)
  const sort = useSearchStore((s) => s.sort)
  const size = useSearchStore((s) => s.size)
  const col = useSearchStore((s) => s.col)

  const total = (result.hits as Record<string, unknown>)
    ? ((result.hits as Record<string, Record<string, number>>).total?.value || 0)
    : 0

  const pushQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    for (const [key, val] of Object.entries(updates)) {
      params.set(key, val)
    }
    params.set('from', '0')
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 my-4">
      <div className="font-bold text-sm">
        {t('search_result')}: {total.toLocaleString()}
        {t('hits')}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {layout !== 'stats' && (
          <>
            <Select value={sort} onValueChange={(v) => pushQuery({ sort: v })}>
              <SelectTrigger className="h-8 w-auto min-w-[140px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(size)} onValueChange={(v) => pushQuery({ size: v })}>
              <SelectTrigger className="h-8 w-auto min-w-[70px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[24, 60, 120, 512].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
        <Select value={layout} onValueChange={(v) => pushQuery({ layout: v })}>
          <SelectTrigger className="h-8 w-auto min-w-[100px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {layoutOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.text)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(layout === 'grid' || layout === 'image') && (
          <Select value={String(col)} onValueChange={(v) => pushQuery({ col: v })}>
            <SelectTrigger className="h-8 w-auto min-w-[60px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 6, 12].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  )
}
