'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useSearchStore } from '@/store/use-search-store'
import { CustomSplit } from './custom-split'
import { getFacetField } from '@/lib/facet-utils'
import { Filter, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const IDX = process.env.NODE_ENV === 'development' ? 'index.html' : ''

export function HpdbSearchResult() {
  const t = useTranslations()
  const result = useSearchStore((s) => s.result) as Record<string, unknown>
  const selected = useSearchStore((s) => s.selected)
  const setSelected = useSearchStore((s) => s.setSelected)
  const index = useSearchStore((s) => s.index)
  const dataAll = useSearchStore((s) => s.data)
  const [dialog, setDialog] = useState(false)
  const [selectedTemp, setSelectedTemp] = useState<string[]>([])

  const hits = (result.hits as Record<string, unknown[]>)?.hits || []

  const select = (id: string) => {
    const newSelected = [...selected]
    const idx = newSelected.indexOf(id)
    if (idx === -1) newSelected.push(id)
    else newSelected.splice(idx, 1)
    setSelected(newSelected)
  }

  const getLabel = (id: string) => {
    if (!index || !index._id || !index._id[id]) return null
    const seq = index._id[id][0]
    return dataAll[seq] as Record<string, unknown>
  }

  const compare = () => {
    const param = selected.map((id) => {
      const obj = getLabel(id)
      if (!obj) return null
      const source = obj._source as Record<string, string[]>
      const related = source._relatedLink[0]
      const spl = related.split('&')
      const manifest = spl[0].split('=')[1]
      const canvas = spl[1].split('=')[1] + '#xywh=' + spl[2].split('=')[1]
      return { manifest, canvas }
    }).filter(Boolean)

    const url =
      BASE_URL +
      '/mirador/' + IDX + '?params=' +
      encodeURIComponent(JSON.stringify(param)) +
      '&layout=1x' +
      selected.length
    window.open(url, '_blank')
  }

  return (
    <div>
      <div className="my-4 text-right flex justify-end gap-2">
        <Button onClick={compare} size="sm">
          {t('compare_items', { count: selected.length })}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setSelectedTemp([]); setDialog(true) }}
        >
          {t('list')}
        </Button>
      </div>

      {/* Selected items dialog */}
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('selected_items')}</DialogTitle>
            <DialogDescription>{selected.length} items selected</DialogDescription>
          </DialogHeader>
          <div className="max-h-72 overflow-y-auto">
            {selected.map((id, i) => {
              const obj = getLabel(id)
              const label = obj ? (obj._source as Record<string, string[]>)?._label?.[0] : id
              return (
                <label key={i} className="flex items-center gap-2 py-1.5 cursor-pointer">
                  <Checkbox
                    checked={selectedTemp.includes(id)}
                    onCheckedChange={() => {
                      setSelectedTemp((prev) =>
                        prev.includes(id)
                          ? prev.filter((x) => x !== id)
                          : [...prev, id]
                      )
                    }}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              )
            })}
          </div>
          <DialogFooter className="gap-2">
            <Button onClick={() => setDialog(false)} size="sm">
              {t('close')}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                const newSelected = selected.filter((id) => !selectedTemp.includes(id))
                setSelected(newSelected)
                setSelectedTemp([])
              }}
            >
              {t('delete')}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setSelected([])}
            >
              {t('reset')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {hits.map((obj: unknown, i: number) => {
        const item = obj as { _id: string; _source: Record<string, string[]> }
        const source = item._source

        return (
          <Card key={i} className="mb-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:w-1/3 space-y-1.5 text-sm">
                  <div>
                    <b>{t('Item Label')}</b>&nbsp;
                    <CustomSplit data={source['Item Label']} field={getFacetField('Item Label')} />
                  </div>
                  <div>
                    <b>{t('Hieratic No')}</b>&nbsp;
                    <CustomSplit data={source['Hieratic No']} field={getFacetField('Hieratic No')} />
                  </div>
                  <div>
                    <b>{t('Hieroglyph No')}</b>&nbsp;
                    <CustomSplit data={source['Hieroglyph No']} field={getFacetField('Hieroglyph No')} />
                  </div>
                  <div className="flex items-center flex-wrap">
                    <b>{t('Item Type')}</b>&nbsp;
                    {source['Item Type']?.map((v, j) => (
                      <span key={j} className="inline-flex items-center">
                        {t(v)}
                        <Link href={`/search?fc-Item+Type=${v}`} className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-muted hover:bg-accent transition-colors" title={t('filter_by_this')}>
                          <Filter className="w-3 h-3" />
                        </Link>
                        {j < source['Item Type'].length - 1 && <>&nbsp;+&nbsp;</>}
                      </span>
                    ))}
                    {source['Unit'] && source['Unit'].length > 0 && (
                      <>
                        &nbsp;<b>{t('Unit')}</b>&nbsp;
                        {source['Unit'].map((v, j) => (
                          <span key={j} className="inline-flex items-center">
                            {t(v)}
                            <Link href={`/search?fc-Unit=${v}`} className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-muted hover:bg-accent transition-colors" title={t('filter_by_this')}>
                              <Filter className="w-3 h-3" />
                            </Link>
                            {j < source['Unit'].length - 1 && <>&nbsp;+&nbsp;</>}
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                  {source['Numeral'] && source['Numeral'].length > 0 && (
                    <div className="flex items-center flex-wrap">
                      <b>{t('Numeral')}</b>&nbsp;
                      {source['Numeral'].map((v, j) => (
                        <span key={j} className="inline-flex items-center">
                          {v}
                          <Link href={`/search?fc-Numeral=${v}`} className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-muted hover:bg-accent transition-colors" title={t('filter_by_this')}>
                            <Filter className="w-3 h-3" />
                          </Link>
                          {j < source['Numeral'].length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  )}
                  {source[getFacetField('Phone/Word')] && source[getFacetField('Phone/Word')].length > 0 && (
                    <div className="flex items-center flex-wrap">
                      <b>{t('Phone/Word')}</b>&nbsp;
                      {source[getFacetField('Phone/Word')].map((v, j, arr) => {
                        const raw = source['Phone/Word']?.[0] || ''
                        const inParens = raw.includes('(' + v) || raw.includes(v + ')')
                        return (
                          <span key={j} className="inline-flex items-center">
                            {inParens && '('}
                            <span className="phone">{v}</span>
                            <Link href={`/search?fc-${encodeURIComponent(getFacetField('Phone/Word'))}=${encodeURIComponent(v)}`} className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-muted hover:bg-accent transition-colors" title={t('filter_by_this')}>
                              <Filter className="w-3 h-3" />
                            </Link>
                            {inParens && ')'}
                            {j < arr.length - 1 && ', '}
                          </span>
                        )
                      })}
                    </div>
                  )}
                  <div>
                    <b>{t('Vol')}</b>&nbsp;{source.Vol?.[0]},&nbsp;
                    <b>{t('Page')}</b>&nbsp;{source.Page?.[0]},&nbsp;
                    <b>{t('Order')}</b>&nbsp;{source.Order?.[0]}
                  </div>
                  {source.Note?.[0] && source.Note[0] !== '' && (
                    <div>
                      <b>{t('Note')}</b>&nbsp;{source.Note[0]}
                    </div>
                  )}
                  <label className="flex items-center mt-2 cursor-pointer gap-2 text-sm text-muted-foreground">
                    <Checkbox
                      checked={selected.includes(item._id)}
                      onCheckedChange={() => select(item._id)}
                    />
                    {t('compare')}
                  </label>
                </div>

                <div className="sm:w-2/3 flex flex-col items-center bg-muted/30 rounded-lg p-4">
                  <Link href={`/item/${item._id}`} className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={source._thumbnail?.[0]}
                      alt={source._label?.[0] || ''}
                      className="max-h-36 object-contain mx-auto transition-transform duration-200 group-hover:scale-105"
                    />
                  </Link>
                  <div className="mt-3">
                    <Link href={`/item/${item._id}`} className="no-underline">
                      <Button variant="default" size="sm" className="gap-1.5 shadow-sm">
                        {t('view_detail')}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
