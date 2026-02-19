import { useTranslations, useLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ShareButtons } from '@/components/common/share-buttons'
import { Filter, ExternalLink } from 'lucide-react'
import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const PREFIX = 'https://w3id.org/hpdb'

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
  const filePath = path.join(process.cwd(), 'public', 'data', 'curation_old.json')
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
  return <ItemContent member={member} id={id} />
}

function ItemContent({ member, id }: { member: CurationMember; id: string }) {
  const t = useTranslations()
  const locale = useLocale()
  const url = `${PREFIX}/item/${id}`

  const metadataObj: Record<string, string[]> = {}
  for (const m of member.metadata) {
    const values = Array.isArray(m.value)
      ? m.value
      : m.value === ''
        ? []
        : [m.value]
    metadataObj[m.label] = values
  }

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
  const iframeUrl = `${BASE_URL}/mirador/?params=${encodeURIComponent(miradorParams)}&hideTitle=true`

  const canvasId = memberIdSpl[0]
  const xywh = memberIdSpl[1]
  const miradorUrl = `${BASE_URL}/mirador/?params=${encodeURIComponent(JSON.stringify([{ manifest: member.manifest, canvas: memberId }]))}`

  const pageNum = canvasId.split('/canvas/p')[1]
  const manifestId = (member.manifest || '').split('/manifest/')[1]?.split('/')[0] || ''
  const utaUrl = `https://iiif.dl.itc.u-tokyo.ac.jp/repo/s/asia/document/${manifestId}#?c=0&m=0&s=0&cv=${Number(pageNum) - 1}&xywh=${xywh}`

  const rdfUrl = `${BASE_URL}/snorql/?describe=${PREFIX}/api/items/${id}`

  return (
    <div>
      <div className="bg-muted">
        <div className="max-w-4xl mx-auto px-4">
          <iframe
            src={iframeUrl}
            width="100%"
            height={350}
            allowFullScreen
            style={{ border: 0 }}
            title="Mirador IIIF Viewer"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-5 mb-10">
        <p className="text-center py-5 flex items-center justify-center gap-2">
          <a href={miradorUrl} target="_blank" rel="noopener noreferrer" title="Mirador">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE_URL}/img/icons/mirador.svg`} width={30} alt="Mirador" />
          </a>
          <a href={utaUrl} target="_blank" rel="noopener noreferrer" title={t('uta')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE_URL}/img/icons/ut.ico`} width={30} alt="UTA" />
          </a>
          <a href={rdfUrl} target="_blank" rel="noopener noreferrer" title="RDF">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE_URL}/img/icons/rdf-logo.svg`} width={30} alt="RDF" />
          </a>
          <ShareButtons url={url} title={id} />
        </p>

        <table className="w-full mt-10 text-sm">
          <tbody>
            <tr className="border-b">
              <td className="w-[30%] py-3 px-2 font-medium">URL</td>
              <td className="py-5 px-2 break-words">
                <a href={url} className="inline-flex items-center gap-1 underline">
                  {url}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </td>
            </tr>
            <tr className="border-b">
              <td className="w-[30%] py-3 px-2 font-medium">ID</td>
              <td className="py-5 px-2 break-words">{id}</td>
            </tr>
            {fields.map((field) => {
              const vals = metadataObj[field.label]
              if (!vals || vals.length === 0) return null
              return (
                <tr key={field.label} className="border-b">
                  <td className="w-[30%] py-3 px-2 font-medium">{t(field.label)}</td>
                  <td className={`py-5 px-2 break-words ${field.label === 'Phone/Word' ? 'phone' : ''}`}>
                    {['Hieratic No', 'Hieroglyph No'].includes(field.label) ? (
                      <SplitValues data={vals} field={`${field.label} Mod`} />
                    ) : field.text ? (
                      vals.map((v, i) => <span key={i}>{v}</span>)
                    ) : (
                      vals.map((v, i) => (
                        <span key={i} className="inline-flex items-center mr-2">
                          {['Item Type', 'Sub Type', 'Unit'].includes(field.label)
                            ? t(v)
                            : v}
                          <Link
                            href={`/search?fc-${field.label}=${encodeURIComponent(v)}`}
                            className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-muted hover:bg-accent transition-colors"
                            title={t('filter_by_this')}
                          >
                            <Filter className="w-3 h-3" />
                          </Link>
                        </span>
                      ))
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="border rounded-lg p-6 text-center mt-10">
          <small>
            <h3 className="mb-5 font-bold">{t('license')}</h3>
            {locale === 'ja' ? (
              <>
                <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="クリエイティブ・コモンズ・ライセンス"
                    style={{ borderWidth: 0, display: 'inline' }}
                    src="https://i.creativecommons.org/l/by/4.0/88x31.png"
                  />
                </a>
                <br />
                この作品は
                <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
                  クリエイティブ・コモンズ 表示 4.0 国際 ライセンス
                </a>
                の下に提供されています。
              </>
            ) : (
              <>
                <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Creative Commons License"
                    style={{ borderWidth: 0, display: 'inline' }}
                    src="https://i.creativecommons.org/l/by/4.0/88x31.png"
                  />
                </a>
                <br />
                This work is licensed under a{' '}
                <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
                  Creative Commons Attribution 4.0 International License
                </a>
                .
              </>
            )}
          </small>
        </div>
      </div>
    </div>
  )
}

function SplitValues({ data, field }: { data: string[]; field: string }) {
  return (
    <span className="inline-flex items-center flex-wrap gap-x-2">
      {data.map((value, i) => {
        const parts = value.split(', ')
        return (
          <span key={i} className="contents">
            {parts.map((part, j) => (
              <span key={j} className="inline-flex items-center">
                {j > 0 && <span className="mr-1">,</span>}
                {part.trim()}
                <Link
                  href={`/search?fc-${field}=${encodeURIComponent(part.trim())}`}
                  className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-muted hover:bg-accent transition-colors"
                  title="Filter"
                >
                  <Filter className="w-3 h-3" />
                </Link>
              </span>
            ))}
          </span>
        )
      })}
    </span>
  )
}
