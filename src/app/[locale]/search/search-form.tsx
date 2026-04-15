'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown } from 'lucide-react'

export function SearchForm() {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()

  const fieldDefs = {
    itemType: { label: 'Item Type', arr: ['Main', 'Ligature', 'Number'], isSelect: true },
    subType: { label: 'Sub Type', arr: ['Numeral', 'Date', 'Fraction', 'Length', 'Area', 'Volume'], isSelect: true },
    unit: { label: 'Unit', arr: ['Single', 'Continuous'], isSelect: true },
    category: { label: 'Category Class', isSelect: false },
    numeral: { label: 'Numeral', isSelect: false },
    vol: { label: 'Vol', arr: ['1', '2', '3'], isSelect: true },
    page: { label: 'Page', isSelect: false },
    order: { label: 'Order', isSelect: false },
  }

  const [selectValues, setSelectValues] = useState<Record<string, string[]>>({
    itemType: [], subType: [], unit: [], vol: [],
  })
  const [textValues, setTextValues] = useState<Record<string, string>>({
    category: '', numeral: '', page: '', order: '',
  })
  const [hieraticNo, setHieraticNo] = useState('')
  const [item, setItem] = useState('')
  const [hieroglyphNo, setHieroglyphNo] = useState('')
  const [phonetic, setPhonetic] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    const allParams: Record<string, string | string[]> = {}
    searchParams?.forEach((value, key) => {
      const existing = allParams[key]
      if (existing) {
        if (Array.isArray(existing)) existing.push(value)
        else allParams[key] = [existing, value]
      } else {
        allParams[key] = value
      }
    })

    const newSelectValues: Record<string, string[]> = { itemType: [], subType: [], unit: [], vol: [] }
    for (const [fieldKey, def] of Object.entries(fieldDefs)) {
      if (def.isSelect) {
        const paramKey = 'fc-' + def.label
        const val = allParams[paramKey]
        if (val) {
          newSelectValues[fieldKey] = Array.isArray(val) ? val : [val]
        }
      }
    }
    setSelectValues(newSelectValues)

    const newTextValues: Record<string, string> = { category: '', numeral: '', page: '', order: '' }
    for (const [fieldKey, def] of Object.entries(fieldDefs)) {
      if (!def.isSelect) {
        const paramKey = 'fc-' + def.label
        if (allParams[paramKey]) {
          newTextValues[fieldKey] = Array.isArray(allParams[paramKey])
            ? (allParams[paramKey] as string[])[0]
            : allParams[paramKey] as string
        }
      }
    }
    setTextValues(newTextValues)

    setHieraticNo((allParams['fc-Hieratic No Search'] as string) || '')
    setHieroglyphNo((allParams['fc-Hieroglyph No Search'] as string) || '')
    setItem((allParams['fc-Item Label Search'] as string) || '')
    setPhonetic((allParams['fc-Phone/Word'] as string) || '')
    setNote((allParams['q-Note'] as string) || '')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSearch = () => {
    const query: Record<string, string | string[]> = {}

    let hn = hieraticNo
    if (['A', 'B', 'C', 'a', 'b', 'c'].includes(hn.slice(-1))) {
      hn = hn.slice(0, hn.length - 1)
    }
    hn = hn.replace('bis', '')
    if (hn !== '') query['fc-Hieratic No Search'] = hn

    let it = item
    if (['A', 'B', 'C', 'a', 'b', 'c'].includes(it.slice(-1))) {
      it = it.slice(0, it.length - 1)
    }
    it = it.replace('bis', '')
    if (it !== '') query['fc-Item Label Search'] = it

    let hgn = hieroglyphNo.split('*').join('')
    if (hgn !== '') query['fc-Hieroglyph No Search'] = hgn

    if (phonetic !== '') query['fc-Phone/Word'] = phonetic
    if (note !== '') query['q-Note'] = note

    for (const [fieldKey, def] of Object.entries(fieldDefs)) {
      if (def.isSelect) {
        const vals = selectValues[fieldKey]
        if (vals && vals.length > 0) query['fc-' + def.label] = vals
      } else {
        const val = textValues[fieldKey]
        if (val && val.length > 0) query['fc-' + def.label] = val
      }
    }

    const params = new URLSearchParams()
    for (const [key, val] of Object.entries(query)) {
      if (Array.isArray(val)) {
        val.forEach((v) => params.append(key, v))
      } else {
        params.append(key, val)
      }
    }

    router.push(`/search?${params.toString()}`)
  }

  const handleReset = () => {
    router.push('/search')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const toggleSelectValue = (fieldKey: string, value: string) => {
    setSelectValues((prev) => {
      const current = prev[fieldKey] || []
      if (current.includes(value)) {
        return { ...prev, [fieldKey]: current.filter((v) => v !== value) }
      }
      return { ...prev, [fieldKey]: [...current, value] }
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-5">
      <Card className="my-5">
        <CardContent className="p-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <div className="lg:col-start-2">
              <MultiSelect
                label={t('Item Type')}
                options={fieldDefs.itemType.arr!.map((v) => ({ value: v, label: t(v) }))}
                selected={selectValues.itemType}
                onChange={(v) => toggleSelectValue('itemType', v)}
              />
            </div>
            <div>
              <MultiSelect
                label={t('Sub Type')}
                options={fieldDefs.subType.arr!.map((v) => ({ value: v, label: t(v) }))}
                selected={selectValues.subType}
                onChange={(v) => toggleSelectValue('subType', v)}
              />
            </div>
            <div>
              <MultiSelect
                label={t('Unit')}
                options={fieldDefs.unit.arr!.map((v) => ({ value: v, label: t(v) }))}
                selected={selectValues.unit}
                onChange={(v) => toggleSelectValue('unit', v)}
              />
            </div>
            <div>
              <label htmlFor="sf-item-label" className="block text-xs text-muted-foreground mb-1">{t('Item Label')}</label>
              <Input
                id="sf-item-label"
                className="h-8"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
            <div>
              <label htmlFor="sf-hieratic-no" className="block text-xs text-muted-foreground mb-1">{t('Hieratic No')}</label>
              <Input
                id="sf-hieratic-no"
                className="h-8"
                value={hieraticNo}
                onChange={(e) => setHieraticNo(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <div className="lg:col-start-2">
              <label htmlFor="sf-category" className="block text-xs text-muted-foreground mb-1">{t('Category Class')}</label>
              <Input
                id="sf-category"
                className="h-8"
                value={textValues.category}
                onChange={(e) => setTextValues((prev) => ({ ...prev, category: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="sf-hieroglyph-no" className="block text-xs text-muted-foreground mb-1">{t('Hieroglyph No')}</label>
              <Input
                id="sf-hieroglyph-no"
                className="h-8"
                value={hieroglyphNo}
                onChange={(e) => setHieroglyphNo(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
            <div>
              <label htmlFor="sf-phonetic" className="block text-xs text-muted-foreground mb-1">{t('Phone/Word')}</label>
              <Input
                id="sf-phonetic"
                className="h-8 phone"
                value={phonetic}
                onChange={(e) => setPhonetic(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
            <div>
              <label htmlFor="sf-numeral" className="block text-xs text-muted-foreground mb-1">{t('Numeral')}</label>
              <Input
                id="sf-numeral"
                className="h-8"
                value={textValues.numeral}
                onChange={(e) => setTextValues((prev) => ({ ...prev, numeral: e.target.value }))}
              />
            </div>
            <div>
              <MultiSelect
                label={t('Vol')}
                options={fieldDefs.vol.arr!.map((v) => ({ value: v, label: v }))}
                selected={selectValues.vol}
                onChange={(v) => toggleSelectValue('vol', v)}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="lg:col-start-2">
              <label htmlFor="sf-page" className="block text-xs text-muted-foreground mb-1">{t('Page')}</label>
              <Input
                id="sf-page"
                className="h-8"
                value={textValues.page}
                onChange={(e) => setTextValues((prev) => ({ ...prev, page: e.target.value }))}
                onKeyDown={handleKeyPress}
              />
            </div>
            <div>
              <label htmlFor="sf-order" className="block text-xs text-muted-foreground mb-1">{t('Order')}</label>
              <Input
                id="sf-order"
                className="h-8"
                value={textValues.order}
                onChange={(e) => setTextValues((prev) => ({ ...prev, order: e.target.value }))}
                onKeyDown={handleKeyPress}
              />
            </div>
            <div>
              <label htmlFor="sf-note" className="block text-xs text-muted-foreground mb-1">{t('Note')}</label>
              <Input
                id="sf-note"
                className="h-8"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className="sm:col-span-2 flex items-end gap-2">
              <Button onClick={handleSearch} size="sm">
                {t('search')}
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm">
                {t('reset')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-8 justify-between text-sm font-normal"
          >
            <span className="truncate">
              {selected.length > 0
                ? selected.map((v) => options.find((o) => o.value === v)?.label || v).join(', ')
                : ''}
            </span>
            <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2" align="start">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer text-sm">
              <Checkbox
                checked={selected.includes(opt.value)}
                onCheckedChange={() => onChange(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  )
}
