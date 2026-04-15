'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Download, FileJson, FileText, ExternalLink, Database, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { JsonLd } from '@/components/json-ld'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://moeller.jinsha.tsukuba.ac.jp'

interface FileEntry {
  label: string
  href: string
  format: 'JSON' | 'CSV'
  size: string
}

interface Dataset {
  titleKey: string
  descKey: string
  icon: React.ElementType
  files: FileEntry[]
  records?: number
  badge?: string
}

const DATASETS: Dataset[] = [
  {
    titleKey: 'datasets_section_index',
    descKey: 'datasets_index_desc',
    icon: Database,
    records: 2065,
    badge: 'JSON',
    files: [
      { label: 'index.json', href: '/data/index.json', format: 'JSON', size: '3.3 MB' },
    ],
  },
  {
    titleKey: 'datasets_section_concordance',
    descKey: 'datasets_concordance_desc',
    icon: FileText,
    records: 937,
    badge: 'JSON / CSV',
    files: [
      { label: 'id_correspondence.json', href: '/data/id_correspondence.json', format: 'JSON', size: '400 KB' },
      { label: 'id_correspondence.csv', href: '/data/id_correspondence.csv', format: 'CSV', size: '140 KB' },
    ],
  },
  {
    titleKey: 'datasets_section_curation',
    descKey: 'datasets_curation_desc',
    icon: FileJson,
    badge: 'IIIF JSON',
    files: [
      { label: 'curation.json', href: '/data/curation.json', format: 'JSON', size: '6.5 MB' },
    ],
  },
  {
    titleKey: 'datasets_section_manifest',
    descKey: 'datasets_manifest_desc',
    icon: BookOpen,
    badge: 'IIIF JSON',
    files: [
      { label: 'manifest Vol.1 (4a1fbed0)', href: '/data/manifest/4a1fbed0-f2a2-4cf5-8a0a-fa310c62ca50/manifest.json', format: 'JSON', size: '—' },
      { label: 'manifest Vol.2 (56653a59)', href: '/data/manifest/56653a59-0d55-4d1a-a7e3-2242e02859a1/manifest.json', format: 'JSON', size: '—' },
      { label: 'manifest Vol.3 (8aaa203c)', href: '/data/manifest/8aaa203c-1c5a-4fef-973b-4fb174d60d37/manifest.json', format: 'JSON', size: '—' },
    ],
  },
]

export function DatasetsContent() {
  const t = useTranslations()
  const locale = useLocale()

  const datasetSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Hieratische Paläographie Database — Datasets',
    description:
      'Open datasets from the Hieratische Paläographie Database including hieratic sign search index, ID concordance table, and IIIF Curation data.',
    url: `${BASE_URL}/${locale}/datasets/`,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: {
      '@type': 'Organization',
      name: 'Hieratische Paläographie DB Project',
    },
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${BASE_URL}/data/index.json`,
        name: 'Hieratic Signs Search Index',
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${BASE_URL}/data/id_correspondence.json`,
        name: 'ID Concordance Table (JSON)',
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/csv',
        contentUrl: `${BASE_URL}/data/id_correspondence.csv`,
        name: 'ID Concordance Table (CSV)',
      },
    ],
    keywords: ['hieratic', 'Egyptology', 'Möller', 'IIIF', 'hieroglyphs', 'palaeography'],
  }

  return (
    <>
      <JsonLd data={datasetSchema} />
      <div className="max-w-4xl mx-auto px-4 my-10">
      <h1 className="text-2xl font-bold mb-2">{t('datasets_title')}</h1>
      <p className="text-muted-foreground mb-8">{t('datasets_desc')}</p>

      {/* Dataset cards */}
      <div className="space-y-6 mb-12">
        {DATASETS.map((ds) => {
          const Icon = ds.icon
          return (
            <div key={ds.titleKey} className="rounded-lg border bg-card p-5">
              <div className="flex items-start gap-3 mb-3">
                <Icon className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-base font-semibold">{t(ds.titleKey)}</h2>
                    {ds.badge && (
                      <Badge variant="secondary" className="text-xs">{ds.badge}</Badge>
                    )}
                    {ds.records && (
                      <Badge variant="outline" className="text-xs">{ds.records.toLocaleString()} {t('datasets_records')}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{t(ds.descKey)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 ml-8">
                {ds.files.map((f) => (
                  <a
                    key={f.label}
                    href={BASE_URL + f.href}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {f.label}
                    <span className="text-xs opacity-70">({f.size})</span>
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <Separator className="mb-10" />

      {/* Metadata table */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">{t('datasets_metadata_title')}</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y">
              {([
                ['datasets_meta_name', 'Hieratische Paläographie Database (HPDB) — Datasets'],
                ['datasets_meta_desc_label', t('datasets_desc')],
                ['datasets_meta_domain', t('datasets_meta_domain_value')],
                ['datasets_meta_contents', t('datasets_meta_contents_value')],
                ['datasets_meta_format', t('datasets_meta_format_value')],
                ['datasets_meta_language', t('datasets_meta_language_value')],
                ['datasets_meta_license', 'CC BY 4.0'],
                ['datasets_meta_provider', t('datasets_meta_provider_value')],
                ['datasets_meta_updated', t('datasets_meta_updated_value')],
                ['datasets_meta_funding', t('datasets_meta_funding_value')],
              ] as [string, string][]).map(([key, value]) => (
                <tr key={key} className="hover:bg-muted/30">
                  <td className="px-4 py-2.5 font-medium text-muted-foreground whitespace-nowrap align-top w-40">
                    {t(key)}
                  </td>
                  <td className="px-4 py-2.5">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Separator className="mb-10" />

      {/* License */}
      <div className="mb-6">
        <h2 className="text-base font-semibold mb-1">{t('datasets_license_title')}</h2>
        <p className="text-sm text-muted-foreground">{t('datasets_license_desc')}</p>
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline"
        >
          CC BY 4.0 <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Citation */}
      <div>
        <h2 className="text-base font-semibold mb-1">{t('datasets_citation_title')}</h2>
        <p className="text-sm text-muted-foreground">{t('datasets_citation_desc')}</p>
      </div>
    </div>
    </>
  )
}
