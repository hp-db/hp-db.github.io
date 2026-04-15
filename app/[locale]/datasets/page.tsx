import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { DatasetsContent } from './datasets-content'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://moeller.jinsha.tsukuba.ac.jp'
  const pageTitle = t('datasets_title')
  const siteName = 'Hieratische Paläographie DB'

  const description =
    locale === 'ja'
      ? 'ヒエラティック古書体学データベースのオープンデータセット。検索インデックス、ID対照表（CSV/JSON）、IIIFキュレーションデータ。CC BY 4.0。'
      : 'Open datasets from the Hieratische Paläographie Database — search index, ID concordance table (CSV/JSON), and IIIF Curation data. CC BY 4.0.'

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: `${base}/${locale}/datasets/`,
      languages: {
        'en': `${base}/en/datasets/`,
        'ja': `${base}/ja/datasets/`,
        'x-default': `${base}/en/datasets/`,
      },
    },
    openGraph: {
      title: `${pageTitle} - ${siteName}`,
      description,
      type: 'website',
      images: [{ url: '/img/ogp/ogp.jpg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pageTitle} - ${siteName}`,
      description,
    },
  }
}

export default async function DatasetsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <DatasetsContent />
}
