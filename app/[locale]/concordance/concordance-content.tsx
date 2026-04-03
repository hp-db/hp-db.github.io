'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ExternalLink } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ConcordanceEntry {
  moller_no: string
  gardiner_no: string
  unicode_cp: string
  unicode_char: string
  jsesh: string
  mdc: string
  hieroglyphica: string
  ifao: string
  wikidata_id: string
  wikidata_label: string
  wikidata_image: string
  tsl_id: string
  desc: string
  match_type: string
}

const RELATED_DATABASES = [
  { nameKey: 'concordance_db_tla_name', descKey: 'concordance_db_tla_desc', url: 'https://thesaurus-linguae-aegyptiae.de/' },
  { nameKey: 'concordance_db_jsesh_name', descKey: 'concordance_db_jsesh_desc', url: 'https://jsesh.qenherkhopeshef.org/' },
  { nameKey: 'concordance_db_unicode_name', descKey: 'concordance_db_unicode_desc', url: 'https://www.unicode.org/charts/PDF/U13000.pdf' },
  { nameKey: 'concordance_db_oraec_name', descKey: 'concordance_db_oraec_desc', url: 'https://oraec.github.io/2022/10/01/converting-manuel-de-codage-to-unicode.html' },
  { nameKey: 'concordance_db_wikidata_name', descKey: 'concordance_db_wikidata_desc', url: 'https://www.wikidata.org/wiki/Q65618976' },
  { nameKey: 'concordance_db_standrews_name', descKey: 'concordance_db_standrews_desc', url: 'https://mjn.host.cs.st-andrews.ac.uk/egyptian/unicode/tablehieratic.html' },
  { nameKey: 'concordance_db_tsl_name', descKey: 'concordance_db_tsl_desc', url: 'https://thotsignlist.org/' },
  { nameKey: 'concordance_db_ifao_name', descKey: 'concordance_db_ifao_desc', url: 'https://www.ifao.egnet.net/publications/publier/outils-ed/polices/' },
]

function gardinerCategory(gardiner: string): string {
  const m = gardiner.match(/^([A-Z]+)/)
  return m ? m[1] : ''
}

function buildExternalLinks(r: ConcordanceEntry) {
  const links: { label: string; url: string }[] = []
  const isSimpleGardiner = r.gardiner_no && !r.gardiner_no.includes('?') && !r.gardiner_no.includes('+') && !r.gardiner_no.includes('/')

  // Unicode character detail
  if (r.unicode_cp) {
    const hex = r.unicode_cp.replace('U+', '')
    links.push({
      label: 'Unicode',
      url: `https://util.unicode.org/UnicodeJsps/character.jsp?a=${hex}`,
    })
  }

  // Wikidata entity
  if (r.wikidata_id) {
    links.push({
      label: 'Wikidata',
      url: `https://www.wikidata.org/wiki/${r.wikidata_id}`,
    })
  }

  // Thot Sign List (direct ID link)
  if (r.tsl_id) {
    links.push({
      label: 'TSL',
      url: `https://thotsignlist.org/mysign?id=${r.tsl_id}`,
    })
  }

  // Wikipedia - Gardiner category section
  if (isSimpleGardiner) {
    const cat = gardinerCategory(r.gardiner_no)
    if (cat) {
      links.push({
        label: 'Wikipedia',
        url: `https://en.wikipedia.org/wiki/List_of_Egyptian_hieroglyphs#${cat}`,
      })
    }
  }

  // JSesh glyph image (CDN)
  if (r.jsesh) {
    links.push({
      label: 'JSesh',
      url: `https://files.qenherkhopeshef.org/jsjsesh/images/glyphs/${r.jsesh}.svg`,
    })
  }

  // HPDB internal search link
  if (isSimpleGardiner) {
    links.push({
      label: 'HPDB',
      url: `/search?fc-Hieroglyph+No+Search=${encodeURIComponent(r.gardiner_no)}`,
    })
  }

  return links
}

export function ConcordanceContent() {
  const t = useTranslations()
  const [data, setData] = useState<ConcordanceEntry[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState<'moller' | 'gardiner'>('moller')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/data/id_correspondence.json`)
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let result = data
    if (q) {
      result = data.filter(
        (r) =>
          r.moller_no.toLowerCase().includes(q) ||
          r.gardiner_no.toLowerCase().includes(q) ||
          r.unicode_cp.toLowerCase().includes(q) ||
          r.jsesh.toLowerCase().includes(q) ||
          r.mdc.toLowerCase().includes(q) ||
          r.wikidata_id.toLowerCase().includes(q) ||
          r.wikidata_label.toLowerCase().includes(q) ||
          r.desc.toLowerCase().includes(q)
      )
    }
    return result.sort((a, b) => {
      if (sortKey === 'moller') {
        const an = parseInt(a.moller_no) || 9999
        const bn = parseInt(b.moller_no) || 9999
        return an - bn
      }
      return a.gardiner_no.localeCompare(b.gardiner_no)
    })
  }, [data, search, sortKey])

  const stats = useMemo(() => {
    const total = data.length
    const matched = data.filter((r) => r.match_type === 'matched').length
    const wikidata = data.filter((r) => r.wikidata_id).length
    return { total, matched, wikidata }
  }, [data])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 my-8">
        <p className="text-muted-foreground">{t('concordance_loading')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 my-8">
      <h1 className="text-2xl font-bold mb-2">{t('concordance_title')}</h1>
      <p className="text-muted-foreground mb-6">
        {t('concordance_desc')}
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        <Badge variant="outline">{t('concordance_total')}: {stats.total}</Badge>
        <Badge variant="outline">{t('concordance_unicode_matched')}: {stats.matched}</Badge>
        <Badge variant="outline">{t('concordance_wikidata_linked')}: {stats.wikidata}</Badge>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <Input
          placeholder={t('concordance_search_placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setSortKey('moller')}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              sortKey === 'moller' ? 'bg-primary text-primary-foreground' : 'bg-background'
            }`}
          >
            {t('concordance_sort_moller')}
          </button>
          <button
            onClick={() => setSortKey('gardiner')}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              sortKey === 'gardiner' ? 'bg-primary text-primary-foreground' : 'bg-background'
            }`}
          >
            {t('concordance_sort_gardiner')}
          </button>
        </div>
        <span className="text-sm text-muted-foreground">{t('concordance_entries', { count: filtered.length })}</span>
      </div>

      <p className="text-xs text-muted-foreground mb-2">
        <ExternalLink className="w-3 h-3 inline" /> {t('concordance_header_link_note')}
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">
              <a href="https://mjn.host.cs.st-andrews.ac.uk/egyptian/unicode/tablehieratic.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                {t('concordance_col_moller')}<ExternalLink className="w-3 h-3" />
              </a>
            </TableHead>
            <TableHead className="w-[90px]">{t('concordance_col_gardiner')}</TableHead>
            <TableHead className="w-[50px] text-center">{t('concordance_col_glyph')}</TableHead>
            <TableHead className="w-[90px]">{t('concordance_col_unicode')}</TableHead>
            <TableHead className="w-[70px]">{t('concordance_col_jsesh')}</TableHead>
            <TableHead className="w-[70px]">{t('concordance_col_mdc')}</TableHead>
            <TableHead className="w-[50px]">{t('concordance_col_hg')}</TableHead>
            <TableHead className="w-[50px]">
              <a href="https://www.ifao.egnet.net/publications/publier/outils-ed/polices/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                {t('concordance_col_ifao')}<ExternalLink className="w-3 h-3" />
              </a>
            </TableHead>
            <TableHead className="w-[120px]">{t('concordance_col_wikidata')}</TableHead>
            <TableHead>{t('concordance_col_links')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((r, i) => {
            const links = buildExternalLinks(r)
            return (
              <TableRow key={i}>
                <TableCell className="font-mono">{r.moller_no || '-'}</TableCell>
                <TableCell className="font-mono">
                  {r.gardiner_no && !r.gardiner_no.includes('?') ? (
                    <a
                      href={`https://en.wikipedia.org/wiki/List_of_Egyptian_hieroglyphs#${gardinerCategory(r.gardiner_no)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {r.gardiner_no}
                    </a>
                  ) : (
                    r.gardiner_no || '-'
                  )}
                </TableCell>
                <TableCell className="text-center text-2xl">{r.unicode_char || '-'}</TableCell>
                <TableCell className="font-mono text-xs">
                  {r.unicode_cp ? (
                    <a
                      href={`https://util.unicode.org/UnicodeJsps/character.jsp?a=${r.unicode_cp.replace('U+', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {r.unicode_cp}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {r.jsesh ? (
                    <a
                      href={`https://files.qenherkhopeshef.org/jsjsesh/images/glyphs/${r.jsesh}.svg`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {r.jsesh}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">{r.mdc || '-'}</TableCell>
                <TableCell className="font-mono text-xs">
                  {r.hieroglyphica ? (
                    r.tsl_id ? (
                      <a
                        href={`https://thotsignlist.org/mysign?id=${r.tsl_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {r.hieroglyphica}
                      </a>
                    ) : (
                      r.hieroglyphica
                    )
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">{r.ifao || '-'}</TableCell>
                <TableCell className="text-xs">
                  {r.wikidata_id ? (
                    <a
                      href={`https://www.wikidata.org/wiki/${r.wikidata_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {r.wikidata_id}
                      {r.wikidata_label && (
                        <span className="block text-muted-foreground">{r.wikidata_label}</span>
                      )}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-xs">
                  {links.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-blue-600 hover:bg-accent text-[11px]"
                        >
                          {link.label}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Separator className="my-10" />

      <h2 className="text-xl font-bold mb-4">{t('concordance_related_databases')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {RELATED_DATABASES.map((db) => (
          <a
            key={db.nameKey}
            href={db.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-2 font-medium text-blue-600">
              {t(db.nameKey)}
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{t(db.descKey)}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
