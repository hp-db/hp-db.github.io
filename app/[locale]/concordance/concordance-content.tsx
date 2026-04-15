'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, ChevronUp } from 'lucide-react'
import {
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
  aku_id?: string
  dpdp_id?: string
  isut_id?: string
  phrp_id?: string
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

// Valid anchor IDs on https://en.wikipedia.org/wiki/List_of_Egyptian_hieroglyphs
const WIKI_GARDINER = new Set(['A1','A10','A11','A12','A13','A14','A14A','A15','A16','A17','A17A','A18','A19','A2','A20','A21','A22','A23','A24','A25','A26','A27','A28','A29','A3','A30','A31','A32','A32A','A33','A34','A35','A36','A37','A38','A39','A4','A40','A40A','A41','A42','A42A','A43','A43A','A44','A45','A45A','A46','A47','A48','A49','A5','A50','A51','A52','A53','A54','A55','A56','A57','A58','A59','A5A','A6','A60','A61','A62','A63','A64','A65','A66','A67','A68','A69','A6A','A6B','A7','A70','A8','A9','Aa1','Aa10','Aa11','Aa12','Aa13','Aa14','Aa15','Aa16','Aa17','Aa18','Aa19','Aa2','Aa20','Aa21','Aa22','Aa23','Aa24','Aa25','Aa26','Aa27','Aa28','Aa29','Aa3','Aa30','Aa31','Aa32','Aa4','Aa5','Aa6','Aa7','Aa7A','Aa7B','Aa8','Aa9','B1','B2','B3','B4','B5','B5A','B6','B7','B8','B9','C1','C10','C10A','C11','C12','C13','C14','C15','C16','C17','C18','C19','C2','C20','C21','C22','C23','C24','C2A','C2B','C2C','C3','C4','C5','C6','C7','C8','C9','D1','D10','D11','D12','D13','D14','D15','D16','D17','D18','D19','D2','D20','D21','D22','D23','D24','D25','D26','D27','D27A','D28','D29','D3','D30','D31','D31A','D32','D33','D34','D34A','D35','D36','D37','D38','D39','D4','D40','D41','D42','D43','D44','D45','D46','D46A','D47','D48','D48A','D49','D5','D50','D50A','D50B','D50C','D50D','D50E','D50F','D50G','D50H','D50I','D51','D52','D52A','D53','D54','D54A','D55','D56','D57','D58','D59','D6','D60','D61','D62','D63','D64','D65','D66','D67','D67A','D67B','D67C','D67D','D67E','D67F','D67G','D67H','D7','D8','D8A','D9','E1','E10','E11','E12','E13','E14','E15','E16','E16A','E17','E17A','E18','E19','E2','E20','E20A','E21','E22','E23','E24','E25','E26','E27','E28','E28A','E29','E3','E30','E31','E32','E33','E34','E34A','E36','E37','E38','E4','E5','E6','E7','E8','E8A','E9','E9A','F1','F10','F11','F12','F13','F13A','F14','F15','F16','F17','F18','F19','F1A','F2','F20','F21','F21A','F22','F23','F24','F25','F26','F27','F28','F29','F3','F30','F31','F31A','F32','F33','F34','F35','F36','F37','F37A','F38','F38A','F39','F4','F40','F41','F42','F43','F44','F45','F45A','F46','F46A','F47','F47A','F48','F49','F5','F50','F51','F51A','F51B','F51C','F52','F53','F6','F7','F8','F9','G1','G10','G11','G11A','G12','G13','G14','G15','G16','G17','G18','G19','G2','G20','G20A','G21','G22','G23','G24','G25','G26','G26A','G27','G28','G29','G3','G30','G31','G32','G33','G34','G35','G36','G36A','G37','G37A','G38','G39','G4','G40','G41','G42','G43','G43A','G44','G45','G45A','G46','G47','G48','G49','G5','G50','G51','G52','G53','G54','G6','G6A','G7','G7A','G7B','G8','G9','H1','H2','H3','H4','H5','H6','H6A','H7','H8','I1','I10','I10A','I11','I11A','I12','I13','I14','I15','I2','I3','I4','I5','I5A','I6','I7','I8','I9','I9A','K1','K2','K3','K4','K5','K6','K7','K8','L1','L2','L2A','L3','L4','L5','L6','L6A','L7','L8','M1','M10','M10A','M11','M12','M12A','M12B','M12C','M12D','M12E','M12F','M12G','M12H','M13','M14','M15','M15A','M16','M16A','M17','M17A','M18','M19','M1A','M1B','M2','M20','M21','M22','M22A','M23','M24','M24A','M25','M26','M27','M28','M28A','M29','M3','M30','M31','M31A','M32','M33','M33A','M33B','M34','M35','M36','M37','M38','M39','M3A','M4','M40','M40A','M41','M42','M43','M44','M5','M6','M7','M8','M9','N1','N10','N11','N12','N13','N14','N15','N16','N17','N18','N18A','N18B','N19','N2','N20','N21','N22','N23','N24','N25','N25A','N26','N27','N28','N29','N3','N30','N31','N32','N33','N33A','N34','N34A','N35','N35A','N36','N37','N37A','N38','N39','N4','N40','N41','N42','N5','N6','N7','N8','N9','O1','O10','O10A','O10B','O10C','O11','O12','O13','O14','O15','O16','O17','O18','O19','O19A','O1A','O2','O20','O20A','O21','O22','O23','O24','O24A','O25','O25A','O26','O27','O28','O29','O29A','O3','O30','O30A','O31','O32','O33','O33A','O34','O35','O36','O36A','O36B','O36C','O36D','O37','O38','O39','O4','O40','O41','O42','O43','O44','O45','O46','O47','O48','O49','O5','O50','O50A','O50B','O51','O5A','O6','O6A','O6B','O6C','O6D','O6E','O6F','O7','O8','O9','P1','P10','P11','P1A','P2','P3','P3A','P4','P5','P6','P7','P8','P9','Q1','Q2','Q3','Q4','Q5','Q6','Q7','R1','R10','R10A','R11','R12','R13','R14','R15','R16','R16A','R17','R18','R19','R2','R20','R21','R22','R23','R24','R25','R26','R27','R28','R29','R2A','R3','R3A','R3B','R4','R5','R6','R7','R8','R9','S1','S10','S11','S12','S13','S14','S14A','S14B','S15','S16','S17','S17A','S18','S19','S2','S20','S21','S22','S23','S24','S25','S26','S26A','S26B','S27','S28','S29','S2A','S3','S30','S31','S32','S33','S34','S35','S35A','S36','S37','S38','S39','S4','S40','S41','S42','S43','S44','S45','S46','S5','S6','S6A','S7','S8','S9','T1','T10','T11','T11A','T12','T13','T14','T15','T16','T16A','T17','T18','T19','T2','T20','T21','T22','T23','T24','T25','T26','T27','T28','T29','T3','T30','T31','T32','T32A','T33','T33A','T34','T35','T36','T3A','T4','T5','T6','T7','T7A','T8','T8A','T9','T9A','U1','U10','U11','U12','U13','U14','U15','U16','U17','U18','U19','U2','U20','U21','U22','U23','U23A','U24','U25','U26','U27','U28','U29','U29A','U3','U30','U31','U32','U32A','U33','U34','U35','U36','U37','U38','U39','U4','U40','U41','U42','U5','U6','U6A','U6B','U7','U8','U9','V1','V10','V11','V11A','V11B','V11C','V12','V12A','V12B','V13','V14','V15','V16','V17','V18','V19','V1A','V1B','V1C','V1D','V1E','V1F','V1G','V1H','V1I','V2','V20','V20A','V20B','V20C','V20D','V20E','V20F','V20G','V20H','V20I','V20J','V20K','V20L','V21','V22','V23','V23A','V24','V25','V26','V27','V28','V28A','V29','V29A','V2A','V3','V30','V30A','V31','V31A','V32','V33','V33A','V34','V35','V36','V37','V37A','V38','V39','V4','V40','V40A','V5','V6','V7','V7A','V7B','V8','V9','W1','W10','W10A','W11','W12','W13','W14','W14A','W15','W16','W17','W17A','W18','W18A','W19','W2','W20','W21','W22','W23','W24','W24A','W25','W3','W3A','W4','W5','W6','W7','W8','W9','W9A','X1','X2','X3','X4','X4A','X4B','X5','X6','X6A','X7','X8','X8A','Y1','Y1A','Y2','Y3','Y4','Y5','Y6','Y7','Y8','Z1','Z10','Z11','Z12','Z13','Z14','Z15','Z15A','Z15B','Z15C','Z15D','Z15E','Z15F','Z15G','Z15H','Z15I','Z16','Z16A','Z16B','Z16C','Z16D','Z16E','Z16F','Z16G','Z16H','Z2','Z2A','Z2B','Z2C','Z2D','Z3','Z3A','Z3B','Z4','Z4A','Z5','Z5A','Z6','Z7','Z8','Z9'])


export function ConcordanceContent() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [data, setData] = useState<ConcordanceEntry[]>([])
  const [search, setSearch] = useState(() => searchParams?.get('q') ?? '')
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState<'moller' | 'gardiner'>(
    () => (searchParams?.get('sort') === 'gardiner' ? 'gardiner' : 'moller')
  )
  const [legendOpen, setLegendOpen] = useState(false)

  const updateParams = useCallback((q: string, sort: string) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (sort !== 'moller') params.set('sort', sort)
    const qs = params.toString()
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
  }, [router, pathname])

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
          r.tsl_id.toLowerCase().includes(q) ||
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
    return {
      total,
      matched,
      tsl:  data.filter((r) => r.tsl_id).length,
      aku:  data.filter((r) => r.aku_id).length,
      dpdp: data.filter((r) => r.dpdp_id).length,
      isut: data.filter((r) => r.isut_id).length,
      phrp: data.filter((r) => r.phrp_id).length,
    }
  }, [data])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-muted-foreground">{t('concordance_loading')}</p>
      </div>
    )
  }

  const COL_DEFS = [
    { label: t('concordance_col_moller'),   href: 'https://mjn.host.cs.st-andrews.ac.uk/egyptian/unicode/tablehieratic.html' },
    { label: t('concordance_col_gardiner'), href: null },
    { label: t('concordance_col_glyph'),    href: null },
    { label: t('concordance_col_jsesh'),    href: null },
    { label: t('concordance_col_hg'),       href: null, title: t('concordance_col_hg_full') },
    { label: t('concordance_col_mdc'),      href: null },
    { label: t('concordance_col_tsl'),      href: 'https://thotsignlist.org/' },
    { label: t('concordance_col_aku'),      href: 'https://aku-pal.uni-mainz.de/graphemes' },
    { label: t('concordance_col_dpdp'),     href: 'http://129.206.5.162/beta/palaeography/' },
    { label: t('concordance_col_isut'),     href: 'https://isut.uliege.be/signs/list' },
    { label: t('concordance_col_phrp'),     href: 'https://www.phrp.be/' },
    { label: t('concordance_col_unicode'),  href: 'https://www.unicode.org/charts/PDF/U13000.pdf' },
  ]

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-4rem)]">

      {/* ─── 上部固定パネル ─── */}
      <div className="shrink-0 bg-background border-b">
        {/* タイトル行 */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-xl font-semibold tracking-tight">{t('concordance_title')}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">{t('concordance_desc')}</p>
          </div>
        </div>

        {/* 検索・ソート行 */}
        <div className="px-5 pb-3 flex flex-wrap items-center gap-2">
          <Input
            placeholder={t('concordance_search_placeholder')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); updateParams(e.target.value, sortKey) }}
            className="h-8 max-w-xs text-sm"
          />

          {/* ソートボタン */}
          <div className="flex rounded-md border overflow-hidden text-sm">
            <button
              onClick={() => { setSortKey('moller'); updateParams(search, 'moller') }}
              className={`px-3 h-8 transition-colors ${
                sortKey === 'moller'
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {t('concordance_sort_moller')}
            </button>
            <button
              onClick={() => { setSortKey('gardiner'); updateParams(search, 'gardiner') }}
              className={`px-3 h-8 border-l transition-colors ${
                sortKey === 'gardiner'
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {t('concordance_sort_gardiner')}
            </button>
          </div>

          {/* 件数・バッジ */}
          <span className="text-xs text-muted-foreground ml-1">
            {t('concordance_entries', { count: filtered.length })}
          </span>
          <div className="hidden sm:flex flex-wrap gap-1.5 ml-auto">
            <Badge variant="secondary" className="text-xs font-normal" title={t('concordance_total')}>
              {stats.total} {t('concordance_stat_entries')}
            </Badge>
            {([
              ['Unicode', stats.matched, t('concordance_stat_unicode_title')],
              ['TSL',     stats.tsl,     t('concordance_stat_tsl_title')],
              ['AKU',     stats.aku,     'AKU-PAL (Mainz)'],
              ['DPDP',    stats.dpdp,    'DPDP Palaeography'],
              ['Isut',    stats.isut,    'Isut (Liège)'],
              ['PHRP',    stats.phrp,    'PHRP'],
            ] as [string, number, string][]).map(([label, count, title]) => (
              <Badge key={label} variant="outline" className="text-xs font-normal" title={title}>
                {label} <span className="ml-1 font-medium">{count}</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* ─── テーブル（スクロール領域） ─── */}
      <div className="flex-1 overflow-auto">
        {/* Table コンポーネントの内部 overflow-auto ラッパーを避け、
            このdivを唯一のスクロールコンテナにするため <table> を直接使う */}
        <table className="w-full border-collapse caption-bottom text-sm">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="align-bottom bg-muted/60 backdrop-blur-sm">
              {COL_DEFS.map(({ label, href, title }) => (
                <TableHead key={label} className="p-0 align-bottom border-b-2 border-border">
                  <div className="flex justify-center">
                    <div
                      className="flex items-end pb-1.5 pt-2"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: '88px', whiteSpace: 'nowrap' }}
                    >
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={title}
                          className="inline-flex items-center gap-0.5 text-xs text-primary hover:underline"
                        >
                          {label}<ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-xs text-foreground/70" title={title}>{label}</span>
                      )}
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((r, i) => {
              const simple = WIKI_GARDINER.has(r.gardiner_no)
              const empty = <span className="text-muted-foreground/40 select-none">–</span>
              const lnk = (href: string, text: string) => (
                <a href={href} target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 hover:underline hover:text-blue-500">
                  {text}
                </a>
              )
              const td = (content: React.ReactNode) => (
                <TableCell className="px-2 py-1 text-center font-mono text-xs">
                  {content}
                </TableCell>
              )
              return (
                <TableRow key={i} className={`hover:bg-primary/5 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                  {/* Möller → HPDB search */}
                  {td(r.moller_no
                    ? <Link href={`/search?q-HieraticNo=${r.moller_no}`} className="font-medium text-blue-600 hover:underline hover:text-blue-500">{r.moller_no}</Link>
                    : empty
                  )}
                  {/* Gardiner */}
                  {td(r.gardiner_no
                    ? (simple
                        ? lnk(`https://en.wikipedia.org/wiki/List_of_Egyptian_hieroglyphs#${r.gardiner_no}`, r.gardiner_no)
                        : r.gardiner_no)
                    : empty
                  )}
                  {/* Glyph */}
                  <TableCell className="px-2 py-0.5 text-center text-xl leading-none">
                    {r.unicode_char || empty}
                  </TableCell>
                  {/* JSesh — link to SVG glyph image */}
                  {td(r.jsesh
                    ? lnk(`https://files.qenherkhopeshef.org/jsjsesh/images/glyphs/${r.jsesh}.svg`, r.jsesh)
                    : empty
                  )}
                  {/* Hieroglyphica */}
                  {td(r.hieroglyphica || empty)}
                  {/* MdC */}
                  {td(r.mdc || empty)}
                  {/* TSL */}
                  {td(r.tsl_id
                    ? lnk(`https://thotsignlist.org/mysign?id=${r.tsl_id}`, r.tsl_id)
                    : empty
                  )}
                  {/* AKU */}
                  {td(r.aku_id
                    ? lnk(`https://aku-pal.uni-mainz.de/graphemes#mdc=${r.mdc}`, r.aku_id)
                    : empty
                  )}
                  {/* DPDP — link via Unicode char query */}
                  {td(r.dpdp_id && r.unicode_char
                    ? lnk(`http://129.206.5.162/beta/palaeography/palaeography.html?q=${encodeURIComponent(r.unicode_char)}`, r.dpdp_id)
                    : empty
                  )}
                  {/* Isut */}
                  {td(r.isut_id
                    ? lnk(`https://isut.uliege.be/signs/list?signname=${r.isut_id}`, r.isut_id)
                    : empty
                  )}
                  {/* PHRP */}
                  {td(r.phrp_id
                    ? lnk(`https://www.phrp.be/ListOccurrences.php?SignKey=${r.phrp_id}`, r.phrp_id)
                    : empty
                  )}
                  {/* Unicode */}
                  {td(r.unicode_cp
                    ? lnk(`https://util.unicode.org/UnicodeJsps/character.jsp?a=${r.unicode_cp.replace('U+', '')}`, r.unicode_cp)
                    : empty
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </table>
      </div>

      {/* ─── 下部：関連データベース（凡例）折りたたみ ─── */}
      <div className="shrink-0 border-t bg-background">
        <button
          onClick={() => setLegendOpen(!legendOpen)}
          className="flex items-center gap-2 w-full px-5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          <ChevronUp
            className={`w-3.5 h-3.5 transition-transform duration-200 ${legendOpen ? '' : 'rotate-180'}`}
          />
          {t('concordance_related_databases')}
          <span className="ml-auto opacity-60">{RELATED_DATABASES.length} databases</span>
        </button>

        {legendOpen && (
          <div className="max-h-56 overflow-y-auto border-t px-5 py-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {RELATED_DATABASES.map((db) => (
                <a
                  key={db.nameKey}
                  href={db.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-1.5 p-2 rounded-md border hover:bg-muted hover:border-primary/30 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                  <div>
                    <div className="text-xs font-medium text-blue-600 group-hover:underline leading-tight">
                      {t(db.nameKey)}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">
                      {t(db.descKey)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
