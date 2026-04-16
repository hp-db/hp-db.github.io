import { useTranslations, useLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ShareButtons } from '@/components/common/share-buttons'
import { getFacetValues } from '@/lib/facet-utils'
import { findConcordanceByMoller, WIKI_GARDINER, type ConcordanceEntry } from '@/lib/concordance-utils'
import { Filter, ExternalLink } from 'lucide-react'
import { CiteButton, CopyUrlButton } from './cite-button'
import { MiradorIframe } from '@/components/mirador-iframe'
import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const PREFIX = 'https://w3id.org/hpdb'
const IDX = process.env.NODE_ENV === 'development' ? 'index.html' : ''

interface CurationMember {
  label: string
  '@id': string
  manifest?: string
  thumbnail?: string
  metadata: { label: string; value: string | string[] }[]
}

interface CurationSelection {
  within: { '@id': string }
  members: CurationMember[]
}

interface CurationData {
  selections: CurationSelection[]
}

function loadCuration(): CurationData {
  const filePath = path.join(process.cwd(), 'public', 'data', 'curation.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

function findMember(id: string): CurationMember | null {
  const data = loadCuration()
  for (const selection of data.selections) {
    const manifest = selection.within['@id']
    for (const member of selection.members) {
      if (member.label === id) {
        return { ...member, manifest }
      }
    }
  }
  return null
}

export async function generateStaticParams() {
  const data = loadCuration()
  const params: { id: string }[] = []
  for (const selection of data.selections) {
    for (const member of selection.members) {
      params.push({ id: member.label })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { id } = await params
  const member = findMember(id)
  const url = `${PREFIX}/item/${id}`
  return {
    title: id,
    openGraph: {
      title: id,
      type: 'article',
      url,
      images: member?.thumbnail ? [member.thumbnail] : [],
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export default async function ItemPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params
  setRequestLocale(locale)
  const member = findMember(id)
  if (!member) {
    return <div className="max-w-4xl mx-auto px-4 my-8">Item not found: {id}</div>
  }

  // Hieratic No (= Möller No) から対照表エントリを取得
  const metadataObj: Record<string, string[]> = {}
  for (const m of member.metadata) {
    const values = Array.isArray(m.value) ? m.value : m.value === '' ? [] : [m.value]
    metadataObj[m.label] = values
  }
  const mollerNo = metadataObj['Hieratic No']?.[0] ?? null
  const concordance = mollerNo ? findConcordanceByMoller(mollerNo) : null

  return <ItemContent member={member} id={id} metadataObj={metadataObj} concordance={concordance} />
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="inline-flex items-center gap-0.5 text-primary hover:underline text-sm">
      {children}
      <ExternalLink className="w-3 h-3 shrink-0" />
    </a>
  )
}

function ConcordanceSection({ entry }: { entry: ConcordanceEntry }) {
  const empty = <span className="text-muted-foreground/40">–</span>

  const lnk = (href: string, text: string) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="inline-flex items-center gap-0.5 text-primary hover:underline font-mono text-xs">
      {text}
      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
    </a>
  )

  const hasWikiLink = WIKI_GARDINER.has(entry.gardiner_no)

  const cells: { label: string; content: React.ReactNode }[] = [
    { label: 'Gardiner', content: entry.gardiner_no
      ? (hasWikiLink
          ? lnk(`https://en.wikipedia.org/wiki/List_of_Egyptian_hieroglyphs#${entry.gardiner_no}`, entry.gardiner_no)
          : <span className="font-mono text-xs">{entry.gardiner_no}</span>)
      : empty },
    { label: 'Glyph', content: entry.unicode_char
      ? <span className="text-xl leading-none">{entry.unicode_char}</span>
      : empty },
    { label: 'JSesh', content: entry.jsesh
      ? lnk(`https://files.qenherkhopeshef.org/jsjsesh/images/glyphs/${entry.jsesh}.svg`, entry.jsesh)
      : empty },
    { label: 'Hieroglyphica', content: entry.hieroglyphica ? <span className="font-mono text-xs">{entry.hieroglyphica}</span> : empty },
    { label: 'MdC', content: entry.mdc ? <span className="font-mono text-xs">{entry.mdc}</span> : empty },
    { label: 'Unicode', content: entry.unicode_cp
      ? lnk(`https://util.unicode.org/UnicodeJsps/character.jsp?a=${entry.unicode_cp.replace('U+', '')}`, entry.unicode_cp)
      : empty },
    { label: 'TSL', content: entry.tsl_id
      ? lnk(`https://thotsignlist.org/mysign?id=${entry.tsl_id}`, entry.tsl_id)
      : empty },
    ...(entry.aku_id ? [{ label: 'AKU', content: lnk(`https://aku-pal.uni-mainz.de/graphemes#mdc=${entry.mdc}`, entry.aku_id) }] : []),
    ...(entry.dpdp_id && entry.unicode_char ? [{ label: 'DPDP', content: lnk(`http://129.206.5.162/beta/palaeography/palaeography.html?q=${encodeURIComponent(entry.unicode_char)}`, entry.dpdp_id) }] : []),
    ...(entry.isut_id ? [{ label: 'Isut', content: lnk(`https://isut.uliege.be/signs/list?signname=${entry.isut_id}`, entry.isut_id) }] : []),
    ...(entry.phrp_id ? [{ label: 'PHRP', content: lnk(`https://www.phrp.be/ListOccurrences.php?SignKey=${entry.phrp_id}`, entry.phrp_id) }] : []),
  ]

  const ROW_SIZE = 4
  const rows: { label: string; content: React.ReactNode }[][] = []
  for (let i = 0; i < cells.length; i += ROW_SIZE) {
    rows.push(cells.slice(i, i + ROW_SIZE))
  }

  return (
    <div className="rounded-lg overflow-hidden ring-1 ring-border shadow-sm">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-2 sm:grid-cols-4 border-b last:border-b-0">
          {row.map(({ label, content }) => (
            <div key={label} className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted/30 transition-colors">
              <span className="text-xs font-medium text-muted-foreground w-14 shrink-0">{label}</span>
              <span>{content}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function ItemContent({
  member, id, metadataObj, concordance,
}: {
  member: CurationMember
  id: string
  metadataObj: Record<string, string[]>
  concordance: ConcordanceEntry | null
}) {
  const t = useTranslations()
  const locale = useLocale()
  const url = `${PREFIX}/item/${id}`

  const fields = [
    { label: 'Item Type' },
    { label: 'Sub Type' },
    { label: 'Unit' },
    { label: 'Vol' },
    { label: 'Page' },
    { label: 'Order' },
    { label: 'Item Label' },
    { label: 'Hieratic No' },
    { label: 'Numeral' },
    { label: 'Category Class' },
    { label: 'Hieroglyph No' },
    { label: 'Phone/Word' },
    { label: 'Note', text: true },
  ]

  const memberId = member['@id']
  const memberIdSpl = memberId.split('#xywh=')
  const miradorParams = JSON.stringify([{ manifest: member.manifest, canvas: memberId }])
  const iframeUrl = `${BASE_URL}/mirador/${IDX}?params=${encodeURIComponent(miradorParams)}&hideTitle=true`
  const canvasId = memberIdSpl[0]
  const xywh = memberIdSpl[1]
  const miradorUrl = `${BASE_URL}/mirador/${IDX}?params=${encodeURIComponent(JSON.stringify([{ manifest: member.manifest, canvas: memberId }]))}`
  const pageNum = canvasId.split('/canvas/p')[1]
  const manifestId = (member.manifest || '').split('/manifest/')[1]?.split('/')[0] || ''
  const utaUrl = `https://iiif.dl.itc.u-tokyo.ac.jp/repo/s/asia/document/${manifestId}#?c=0&m=0&s=0&cv=${Number(pageNum) - 1}&xywh=${xywh}`
  const rdfUrl = `${BASE_URL}/snorql/${IDX}?describe=${PREFIX}/api/items/${id}`

  // Hieroglyph No からタイトル補助テキストを作る
  const hieroglyphNo = metadataObj['Hieroglyph No']?.[0] ?? ''
  const hieraticNo = metadataObj['Hieratic No']?.[0] ?? ''

  return (
    <div>
      {/* IIIF ビューア */}
      <div className="bg-muted border-b">
        <div className="max-w-5xl mx-auto px-4">
          <MiradorIframe baseUrl={iframeUrl} height={350} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8 mb-16">
        {/* h1 — SEO + アクセシビリティ */}
        <h1 className="text-xl font-bold mb-6 tracking-tight">
          {t('Hieratische Paläographie DB')} — {t('Hieratic No')} {hieraticNo}
          {hieroglyphNo && <span className="ml-2 text-muted-foreground font-normal text-base">({t('Hieroglyph No')} {hieroglyphNo})</span>}
        </h1>

        {/* 2カラム: 左=メタデータ、右=リンク＋利用条件 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-8">

          {/* 左: メタデータ */}
          <div>
            <table className="w-full text-sm border-collapse ring-1 ring-border rounded-lg overflow-hidden">
              <tbody>
                {fields.map((field) => {
                  const vals = metadataObj[field.label]
                  if (!vals || vals.length === 0) return null
                  const { facetField, values: facetValues } = getFacetValues(metadataObj, field.label)
                  return (
                    <tr key={field.label} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-muted-foreground bg-muted/20 w-36">{t(field.label)}</td>
                      <td className={`py-2.5 px-3 break-words ${field.label === 'Phone/Word' ? 'phone' : ''}`}>
                        {field.text ? (
                          vals.map((v, i) => <span key={i}>{v}</span>)
                        ) : (
                          <span className="inline-flex items-center flex-wrap gap-x-2">
                            {facetValues.map((v, i) => (
                              <span key={i} className="inline-flex items-center">
                                {['Item Type', 'Sub Type', 'Unit'].includes(field.label) ? t(v) : v}
                                <Link
                                  href={`/search?fc-${encodeURIComponent(facetField)}=${encodeURIComponent(v)}`}
                                  className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-muted hover:bg-accent transition-colors"
                                  title={t('filter_by_this')}
                                >
                                  <Filter className="w-3 h-3" />
                                </Link>
                              </span>
                            ))}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* 右カラム: リンク / URL / 引用 / ライセンス / ID対照表 */}
          <div className="space-y-4">

            {/* 外部リンク */}
            <div className="rounded-lg border p-4 space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Links</p>
              <ExtLink href={miradorUrl}>Mirador IIIF Viewer</ExtLink>
              <br />
              <ExtLink href={utaUrl}>{t('uta')}</ExtLink>
              {member.manifest && (
                <>
                  <br />
                  <ExtLink href={member.manifest}>IIIF Manifest (JSON-LD)</ExtLink>
                </>
              )}
              <br />
              <ExtLink href={rdfUrl}>RDF / SPARQL</ExtLink>
            </div>

            {/* 永続URI + コピー + シェア */}
            <div className="rounded-lg border p-4">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Persistent URI</p>
              <div className="flex items-center gap-1 bg-muted rounded px-2 py-1.5">
                <code className="flex-1 text-xs font-mono break-all leading-tight">{url}</code>
                <CopyUrlButton url={url} />
              </div>
              <div className="mt-2">
                <ShareButtons url={url} title={id} />
              </div>
            </div>

            {/* 引用 */}
            <div className="rounded-lg border p-4">
              <CiteButton id={id} url={url} hieraticNo={hieraticNo} hieroglyphNo={hieroglyphNo} />
            </div>

            {/* ライセンス */}
            <div className="rounded-lg border p-4 text-center">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">{t('license')}</p>
              <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Creative Commons BY 4.0"
                  style={{ borderWidth: 0, display: 'inline' }}
                  src="https://i.creativecommons.org/l/by/4.0/88x31.png"
                />
              </a>
              <p className="text-xs mt-1">
                <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"
                  className="text-primary hover:underline">
                  CC BY 4.0
                </a>
              </p>
            </div>

          </div>
        </div>

        {/* ID 対照表（全幅） */}
        {concordance && (
          <div className="mt-6">
            <h2 className="text-base font-semibold mb-3 tracking-tight">
              ID Concordance
              <Link href={`/concordance?q=${concordance.moller_no}`}
                className="ml-3 text-xs font-normal text-primary hover:underline">
                {locale === 'ja' ? '全体を見る →' : 'Full table →'}
              </Link>
            </h2>
            <ConcordanceSection entry={concordance} />
          </div>
        )}
      </div>
    </div>
  )
}
